import html

def escape_val(val):
    if val is None:
        return ""
    if isinstance(val, (int, float, bool)):
        return str(val)
    return html.escape(str(val))


def normalize_resume_data(data):
    if not isinstance(data, dict):
        return {}

    personal = data.get("personal", {})
    if not isinstance(personal, dict):
        personal = {}

    full_name = (
        personal.get("fullName")
        or personal.get("full_name")
        or personal.get("name")
        or data.get("fullName")
        or data.get("full_name")
        or data.get("name")
        or ""
    )

    title = personal.get("title") or personal.get("job_title") or data.get("title") or ""
    email = personal.get("email") or data.get("email") or ""
    phone = personal.get("phone") or personal.get("phone_cell") or personal.get("phone_home") or data.get("phone") or ""
    location = personal.get("location") or personal.get("address") or data.get("location") or ""
    linkedin = personal.get("linkedin") or personal.get("linkedin_url") or data.get("linkedin") or ""
    website = personal.get("website") or personal.get("portfolio") or personal.get("link") or personal.get("profile_url") or data.get("website") or ""

    summary = data.get("summary") or data.get("summary_statement") or ""

    # Normalize skills
    raw_skills = data.get("skills") or data.get("qualifications") or []
    skills = []
    if isinstance(raw_skills, list):
        for s in raw_skills:
            if isinstance(s, dict):
                skills.append(s.get("name") or s.get("skill") or "")
            elif isinstance(s, str) and s.strip():
                skills.append(s.strip())
    elif isinstance(raw_skills, str):
        skills = [s.strip() for s in raw_skills.split(",") if s.strip()]

    # Normalize experience
    raw_exp = data.get("experience") or data.get("work_experience") or data.get("jobs") or []
    experience = []
    if isinstance(raw_exp, list):
        for item in raw_exp:
            if isinstance(item, dict):
                role = item.get("role") or item.get("title") or item.get("job_title") or ""
                company = item.get("company") or item.get("organization") or ""
                loc = item.get("location") or ""
                start = item.get("start") or item.get("start_date") or ""
                end = item.get("end") or item.get("end_date") or ""
                current = item.get("current", False)
                if current:
                    duration = f"{start} – Present" if start else "Present"
                elif start and end:
                    duration = f"{start} – {end}"
                elif start:
                    duration = start
                else:
                    duration = item.get("duration") or ""

                desc = item.get("description") or item.get("desc") or ""
                bullets = item.get("bullets", [])
                if not bullets and desc:
                    bullets = [b.strip() for b in desc.split("\n") if b.strip()]

                if not role and not company and not desc:
                    continue

                experience.append({
                    "role": role,
                    "title": role,
                    "company": company,
                    "location": loc,
                    "start": start,
                    "end": "Present" if current else end,
                    "duration": duration,
                    "current": current,
                    "description": desc,
                    "bullets": bullets,
                })

    # Normalize education
    raw_edu = data.get("education") or data.get("degrees") or []
    education = []
    if isinstance(raw_edu, list):
        for item in raw_edu:
            if isinstance(item, dict):
                degree = item.get("degree") or ""
                school = item.get("school") or item.get("university") or item.get("institution") or ""
                loc = item.get("location") or ""
                start = item.get("start") or item.get("start_date") or ""
                end = item.get("end") or item.get("end_date") or ""
                duration = f"{start} – {end}" if start and end else (start or end or "")
                field = item.get("field") or item.get("major") or ""
                honor = item.get("honor") or ""
                details = item.get("details", [])

                if not degree and not school:
                    continue

                education.append({
                    "degree": degree,
                    "school": school,
                    "location": loc,
                    "start": start,
                    "end": end,
                    "duration": duration,
                    "field": field,
                    "honor": honor,
                    "details": details,
                })

    # Normalize projects
    raw_proj = data.get("projects") or []
    projects = []
    if isinstance(raw_proj, list):
        for item in raw_proj:
            if isinstance(item, dict):
                name = item.get("name") or item.get("title") or ""
                link = item.get("link") or item.get("url") or ""
                tech = item.get("technologies") or item.get("tech") or ""
                desc = item.get("description") or item.get("desc") or ""
                if not name and not desc:
                    continue
                projects.append({
                    "name": name,
                    "title": name,
                    "link": link,
                    "technologies": tech,
                    "description": desc,
                })

    # Normalize certifications
    raw_cert = data.get("certifications") or []
    certifications = []
    if isinstance(raw_cert, list):
        for item in raw_cert:
            if isinstance(item, dict):
                if item.get("name"):
                    certifications.append({
                        "name": item.get("name") or "",
                        "issuer": item.get("issuer") or item.get("organization") or "",
                        "date": item.get("date") or "",
                    })
            elif isinstance(item, str) and item.strip():
                certifications.append({"name": item.strip(), "issuer": "", "date": ""})

    sections = data.get("sections", {})
    if not isinstance(sections, dict):
        sections = {}

    normalized = {
        "name": full_name,
        "fullName": full_name,
        "full_name": full_name,
        "first_name": full_name.split()[0] if full_name else "",
        "last_name": " ".join(full_name.split()[1:]) if len(full_name.split()) > 1 else "",
        "title": title,
        "job_title": title,
        "email": email,
        "phone": phone,
        "phone_cell": phone,
        "phone_home": phone,
        "location": location,
        "address": location,
        "linkedin": linkedin,
        "website": website,
        "profile_url": website or linkedin or "#",
        "profile_label": website or linkedin or "",
        "summary": summary if sections.get("summary", True) else "",
        "summary_statement": summary if sections.get("summary", True) else "",
        "skills": skills if sections.get("skills", True) else [],
        "qualifications": skills if sections.get("skills", True) else [],
        "experience": experience if sections.get("experience", True) else [],
        "education": education if sections.get("education", True) else [],
        "projects": projects if sections.get("projects", True) else [],
        "certifications": certifications if sections.get("certifications", True) else [],
        "sections": sections,
    }
    return normalized


def resolve_lookup(ctx, path):
    if not path:
        return ""
    parts = path.strip().split(".")
    curr = ctx
    for p in parts:
        if isinstance(curr, dict) and p in curr:
            curr = curr[p]
        elif isinstance(curr, (list, tuple)) and p == "length":
            curr = len(curr)
        else:
            return ""
    return curr


def find_matching_close(template, tag_type, start_after_open_idx):
    depth = 1
    cursor = start_after_open_idx
    open_tag = f"{{{{#{tag_type}"
    close_tag = f"{{{{/{tag_type}}}}}"

    while cursor < len(template):
        next_open_idx = template.find(open_tag, cursor)
        next_close_idx = template.find(close_tag, cursor)

        if next_close_idx == -1:
            return -1

        if next_open_idx != -1 and next_open_idx < next_close_idx:
            depth += 1
            cursor = next_open_idx + len(open_tag)
        else:
            depth -= 1
            if depth == 0:
                return next_close_idx
            cursor = next_close_idx + len(close_tag)

    return -1


def render_html_list(items, tag="ul", item_class="", list_class=""):
    if not items:
        return ""
    cls_attr = f' class="{list_class}"' if list_class else ""
    li_cls = f' class="{item_class}"' if item_class else ""
    lis = "".join(f"<li{li_cls}>{escape_val(item)}</li>" for item in items if item)
    return f"<{tag}{cls_attr}>{lis}</{tag}>"


def render_default_experience(experience):
    if not experience:
        return ""
    out = []
    for exp in experience:
        dur = escape_val(exp.get("duration", ""))
        date_html = f'<div class="resume-entry-date">{dur}</div>' if dur else ""
        sub = escape_val(exp.get("company", ""))
        if exp.get("location"):
            sub += f' &mdash; {escape_val(exp.get("location"))}'
        
        desc = exp.get("description", "")
        desc_html = f'<div class="resume-entry-desc">{escape_val(desc)}</div>' if desc else ""
        
        out.append(f"""
        <div class="resume-entry">
            <div class="resume-entry-top">
                <div>
                    <div class="resume-entry-title">{escape_val(exp.get("role", ""))}</div>
                    <div class="resume-entry-sub">{sub}</div>
                </div>
                {date_html}
            </div>
            {desc_html}
        </div>
        """)
    return "\n".join(out)


def render_default_education(education):
    if not education:
        return ""
    out = []
    for edu in education:
        dur = escape_val(edu.get("duration", ""))
        date_html = f'<div class="resume-entry-date">{dur}</div>' if dur else ""
        sub = escape_val(edu.get("school", ""))
        if edu.get("location"):
            sub += f' &mdash; {escape_val(edu.get("location"))}'
        
        out.append(f"""
        <div class="resume-entry">
            <div class="resume-entry-top">
                <div>
                    <div class="resume-entry-title">{escape_val(edu.get("degree", ""))}</div>
                    <div class="resume-entry-sub">{sub}</div>
                </div>
                {date_html}
            </div>
        </div>
        """)
    return "\n".join(out)


def render_default_projects(projects):
    if not projects:
        return ""
    out = []
    for proj in projects:
        link = proj.get("link", "")
        link_html = f'<a class="resume-entry-date" href="{escape_val(link)}" target="_blank" rel="noopener noreferrer">{escape_val(link)}</a>' if link else ""
        desc = proj.get("description", "")
        desc_html = f'<div class="resume-entry-desc">{escape_val(desc)}</div>' if desc else ""
        tech = proj.get("technologies", "")
        tech_html = f'<div class="resume-project-tech"><strong>Technologies:</strong> {escape_val(tech)}</div>' if tech else ""

        out.append(f"""
        <div class="resume-entry">
            <div class="resume-entry-top">
                <div class="resume-entry-title">{escape_val(proj.get("name", ""))}</div>
                {link_html}
            </div>
            {desc_html}
            {tech_html}
        </div>
        """)
    return "\n".join(out)


def render_block(template, ctx):
    result = []
    cursor = 0

    while cursor < len(template):
        open_idx = template.find("{{#", cursor)
        if open_idx == -1:
            result.append(template[cursor:])
            break

        result.append(template[cursor:open_idx])

        tag_end_idx = template.find("}}", open_idx)
        if tag_end_idx == -1:
            result.append(template[open_idx:])
            break

        tag_content = template[open_idx + 3 : tag_end_idx].strip()
        space_idx = tag_content.find(" ")
        tag_type = tag_content[:space_idx].strip() if space_idx != -1 else tag_content
        expr = tag_content[space_idx + 1:].strip() if space_idx != -1 else ""

        close_start = tag_end_idx + 2
        close_end = find_matching_close(template, tag_type, close_start)

        if close_end == -1:
            cursor = tag_end_idx + 2
            continue

        inner_template = template[close_start:close_end]
        cursor = close_end + len(f"{{{{/{tag_type}}}}}")

        if tag_type == "if":
            val = resolve_lookup(ctx, expr)
            is_truthy = val and (not isinstance(val, (list, dict)) or len(val) > 0)
            if is_truthy:
                result.append(render_block(inner_template, ctx))
        elif tag_type == "unless":
            val = resolve_lookup(ctx, expr)
            is_truthy = val and (not isinstance(val, (list, dict)) or len(val) > 0)
            if not is_truthy:
                result.append(render_block(inner_template, ctx))
        elif tag_type == "each":
            items = resolve_lookup(ctx, expr)
            if isinstance(items, list):
                for item in items:
                    if isinstance(item, dict):
                        item_ctx = {**ctx, **item, "this": item}
                    else:
                        item_ctx = {**ctx, "this": item}
                    result.append(render_block(inner_template, item_ctx))

    rendered_text = "".join(result)

    # Standalone section tags
    if "{{skills}}" in rendered_text or "{{qualifications}}" in rendered_text:
        skills_html = render_html_list(ctx.get("skills", []), tag="ul", list_class="qual-list")
        rendered_text = rendered_text.replace("{{skills}}", skills_html).replace("{{qualifications}}", skills_html)

    if "{{experience}}" in rendered_text or "{{work_experience}}" in rendered_text:
        exp_html = render_default_experience(ctx.get("experience", []))
        rendered_text = rendered_text.replace("{{experience}}", exp_html).replace("{{work_experience}}", exp_html)

    if "{{education}}" in rendered_text:
        edu_html = render_default_education(ctx.get("education", []))
        rendered_text = rendered_text.replace("{{education}}", edu_html)

    if "{{projects}}" in rendered_text:
        proj_html = render_default_projects(ctx.get("projects", []))
        rendered_text = rendered_text.replace("{{projects}}", proj_html)

    # Replace scalar tags
    import re
    def scalar_replacer(match):
        k = match.group(1).strip()
        if k == "this":
            return escape_val(ctx.get("this", ""))
        val = resolve_lookup(ctx, k)
        if isinstance(val, (str, int, float, bool)):
            return escape_val(val)
        return ""

    return re.sub(r"\{\{([a-zA-Z0-9_.]+)\}\}", scalar_replacer, rendered_text)


def render_resume_template(template_html, resume_data):
    if not template_html:
        return ""
    ctx = normalize_resume_data(resume_data)
    return render_block(template_html, ctx)
