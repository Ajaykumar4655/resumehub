import re
from pdfminer.high_level import extract_text
from io import BytesIO
from docx import Document
import json

def extract_text_from_file(file_obj, filename):
    fname = filename.lower()

    if fname.endswith('.pdf'):
        try:
            file_bytes = file_obj.read()
            buffer = BytesIO(file_bytes)
            text = extract_text(buffer)
            # Regex patterns for personal info
            patterns = {
                "email": r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",
                "phone": r"\+?\d[\d\s\-]{7,}\d",
                "linkedin": r"(https?://)?(www\.)?linkedin\.com/in/[A-Za-z0-9\-_]+",
                "github": r"(https?://)?(www\.)?github\.com/[A-Za-z0-9\-_]+",
                "portfolio": r"(https?://)?[A-Za-z0-9\-_.]+\.(dev|io|me)",   
            }

            cleaned = text
            # Remove each pattern
            for name, pattern in patterns.items():
                cleaned = re.sub(pattern, "", cleaned, flags=re.IGNORECASE)

            # Remove extra blank lines
            cleaned = re.sub(r"\n\s*\n", "\n", cleaned)
            return cleaned.strip()

        except Exception as e:
            raise Exception(str(e))
    elif fname.endswith(".docx") :
        try:
            doc = Document(file_obj)
            text = "\n".join(p.text for p in doc.paragraphs)

            patterns = {
                "email": r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",
                "phone": r"\+?\d[\d\s\-]{7,}\d",
                "linkedin": r"(https?://)?(www\.)?linkedin\.com/in/[A-Za-z0-9\-_]+",
                "github": r"(https?://)?(www\.)?github\.com/[A-Za-z0-9\-_]+",
                "portfolio": r"(https?://)?[A-Za-z0-9\-_.]+\.(dev|io|me)",   
            }

            for name, pattern in patterns.items():
                text = re.sub(pattern,"", text, flags=re.IGNORECASE)
            
            return text.strip()       
        except Exception as e:
            raise Exception(str(e))
    elif fname.endswith(".txt"):
        try:
            text = file_obj.read().decode('utf-8')

            patterns = {
                "email": r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",
                "phone": r"\+?\d[\d\s\-]{7,}\d",
                "linkedin": r"(https?://)?(www\.)?linkedin\.com/in/[A-Za-z0-9\-_]+",
                "github": r"(https?://)?(www\.)?github\.com/[A-Za-z0-9\-_]+",
                "portfolio": r"(https?://)?[A-Za-z0-9\-_.]+\.(dev|io|me)",   
            }

            for name, pattern in patterns.items():
                text = re.sub(pattern, "", text, flags=re.IGNORECASE)

            return text.strip() 
        except Exception as e:
            raise Exception(str(e))   
    else:
        raise Exception("Only Provide .pdf, .docx, .txt files")


def extract_json(result):
    match = re.search(r'\{.*\}', result, re.DOTALL)
    if not match:
        raise ValueError("No JSON found in Gemini response")
    return json.loads(match.group())
