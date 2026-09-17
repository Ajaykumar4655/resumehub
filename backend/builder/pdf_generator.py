import os
import sys
import shutil
import tempfile
import subprocess
from pathlib import Path
from django.conf import settings
from .template_engine import render_resume_template


def find_chromium_executable():
    """
    Finds a Chromium-based browser executable on the system.
    Supports Windows (Edge, Chrome, Brave) and Linux/macOS (google-chrome, chromium).
    """
    # 1. Custom env var override if specified
    env_browser = os.environ.get("CHROME_PATH") or os.environ.get("CHROMIUM_PATH")
    if env_browser and os.path.isfile(env_browser):
        return env_browser

    # 2. Windows known paths
    if sys.platform == "win32":
        candidate_paths = [
            r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
            r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\Edge\Application\msedge.exe"),
            os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
            os.path.expandvars(r"%PROGRAMFILES%\BraveSoftware\Brave-Browser\Application\brave.exe"),
        ]
        for path in candidate_paths:
            if os.path.isfile(path):
                return path

    # 3. PATH search
    for cmd in ["msedge", "chrome", "google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]:
        found = shutil.which(cmd)
        if found:
            return found

    return None


def resolve_media_images(html_content):
    """
    Replaces relative /media/ URLs with file:/// URLs so headless browser/weasyprint can load local assets.
    """
    if not html_content:
        return html_content

    media_url = getattr(settings, "MEDIA_URL", "/media/")
    media_root = getattr(settings, "MEDIA_ROOT", None)

    if media_root and os.path.isdir(media_root):
        media_root_path = Path(media_root).resolve().as_uri()
        # Replace occurrences of media_url with media_root_path
        html_content = html_content.replace(f'"{media_url}', f'"{media_root_path}/')
        html_content = html_content.replace(f"'{media_url}", f"'{media_root_path}/")

    return html_content


def build_full_html(template_css, rendered_body):
    """
    Wraps the template body in an A4 print-ready HTML shell with print-optimized CSS.
    """
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Resume</title>
<style>
  @page {{
    size: A4 portrait;
    margin: 0;
  }}
  *, *::before, *::after {{
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }}
  html, body {{
    margin: 0;
    padding: 0;
    width: 210mm;
    height: 297mm;
    max-height: 297mm;
    overflow: hidden;
    background: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #111111;
    word-break: break-word;
    overflow-wrap: break-word;
  }}
  
  /* Container styling for single page PDF */
  .resume-doc, .resume, .resume-a4-page {{
    width: 210mm !important;
    height: 297mm !important;
    max-height: 297mm !important;
    overflow: hidden !important;
    margin: 0 auto !important;
    box-shadow: none !important;
    background: #ffffff !important;
  }}

  /* Page-break avoidance for logical sections */
  .resume-entry, .resume__job, .resume__edu-item, .resume-section, .qual-list li {{
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }}

  /* Template CSS */
  {template_css or ""}
</style>
</head>
<body>
{rendered_body}
</body>
</html>"""


def generate_with_chromium(full_html):
    """
    Generates PDF using Headless Chromium (Edge / Chrome).
    """
    browser_path = find_chromium_executable()
    if not browser_path:
        raise RuntimeError("No Chromium-based browser (Edge, Chrome) found for PDF generation.")

    with tempfile.TemporaryDirectory() as tmpdir:
        html_path = os.path.join(tmpdir, "resume.html")
        pdf_path = os.path.join(tmpdir, "resume.pdf")

        with open(html_path, "w", encoding="utf-8") as f:
            f.write(full_html)

        cmd = [
            browser_path,
            "--headless",
            "--disable-gpu",
            "--no-pdf-header-footer",
            "--no-margins",
            "--run-all-compositor-stages-before-draw",
            f"--print-to-pdf={pdf_path}",
            html_path,
        ]

        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=20)
        if result.returncode != 0 and not os.path.isfile(pdf_path):
            raise RuntimeError(f"Chromium PDF generation failed: {result.stderr.decode('utf-8', errors='ignore')}")

        if not os.path.isfile(pdf_path):
            raise RuntimeError("Chromium finished but output PDF file was not found.")

        with open(pdf_path, "rb") as f:
            return f.read()


def generate_with_weasyprint(full_html):
    """
    Generates PDF using WeasyPrint if installed and functional.
    """
    import weasyprint
    base_url = str(settings.BASE_DIR)
    wp_html = weasyprint.HTML(string=full_html, base_url=base_url)
    return wp_html.write_pdf()


def generate_resume_pdf(template, resume_data):
    """
    Main entrypoint:
    1. Renders template HTML with resume data.
    2. Builds full A4 HTML shell with CSS.
    3. Tries WeasyPrint, then Headless Chromium.
    4. Returns PDF bytes.
    """
    raw_html = template.html_content if hasattr(template, "html_content") else getattr(template, "html", "")
    raw_css = template.css_content if hasattr(template, "css_content") else getattr(template, "css", "")

    rendered_body = render_resume_template(raw_html, resume_data)
    rendered_body = resolve_media_images(rendered_body)

    full_html = build_full_html(raw_css, rendered_body)

    # 1. Try WeasyPrint first
    try:
        return generate_with_weasyprint(full_html)
    except Exception:
        # Fall back to Headless Chromium
        pass

    # 2. Try Headless Chromium
    return generate_with_chromium(full_html)
