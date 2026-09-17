/**
 * Client-side safe resume template rendering engine.
 * Recursive block parser for {{#if}}, {{#unless}}, {{#each}} with exact tag balancing.
 * Matches backend/builder/template_engine.py logic 1:1.
 */

export function escapeHtml(str) {
    if (str === null || str === undefined) return ""
    if (typeof str === "number" || typeof str === "boolean") return String(str)
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
}

export function normalizeResumeData(data = {}) {
    const personal = data.personal || {}

    const fullName = personal.fullName || personal.full_name || personal.name || data.fullName || data.full_name || data.name || ""
    const title = personal.title || personal.job_title || data.title || ""
    const email = personal.email || data.email || ""
    const phone = personal.phone || personal.phone_cell || personal.phone_home || data.phone || ""
    const location = personal.location || personal.address || data.location || ""
    const linkedin = personal.linkedin || personal.linkedin_url || data.linkedin || ""
    const website = personal.website || personal.portfolio || personal.link || personal.profile_url || data.website || ""

    const summary = data.summary || data.summary_statement || ""

    // Skills
    const rawSkills = data.skills || data.qualifications || []
    let skills = []
    if (Array.isArray(rawSkills)) {
        skills = rawSkills.map((s) => (typeof s === "object" && s !== null ? s.name || s.skill || "" : String(s).trim())).filter(Boolean)
    } else if (typeof rawSkills === "string") {
        skills = rawSkills.split(",").map((s) => s.trim()).filter(Boolean)
    }

    // Experience
    const rawExp = data.experience || data.work_experience || data.jobs || []
    const experience = (Array.isArray(rawExp) ? rawExp : []).map((item) => {
        if (!item || typeof item !== "object") return null
        const role = item.role || item.title || item.job_title || ""
        const company = item.company || item.organization || ""
        const loc = item.location || ""
        const start = item.start || item.start_date || ""
        const end = item.end || item.end_date || ""
        const current = Boolean(item.current)
        let duration = item.duration || ""
        if (current) {
            duration = start ? `${start} – Present` : "Present"
        } else if (start && end) {
            duration = `${start} – ${end}`
        } else if (start) {
            duration = start
        }

        const desc = item.description || item.desc || ""
        let bullets = Array.isArray(item.bullets) ? item.bullets : []
        if (!bullets.length && desc) {
            bullets = desc.split("\n").map((b) => b.trim()).filter(Boolean)
        }

        // Only include if at least role, company, or description is present
        if (!role && !company && !desc) return null

        return {
            role,
            title: role,
            company,
            location: loc,
            start,
            end: current ? "Present" : end,
            duration,
            current,
            description: desc,
            bullets,
        }
    }).filter(Boolean)

    // Education
    const rawEdu = data.education || data.degrees || []
    const education = (Array.isArray(rawEdu) ? rawEdu : []).map((item) => {
        if (!item || typeof item !== "object") return null
        const degree = item.degree || ""
        const school = item.school || item.university || item.institution || ""
        const loc = item.location || ""
        const start = item.start || item.start_date || ""
        const end = item.end || item.end_date || ""
        const duration = item.duration || (start && end ? `${start} – ${end}` : start || end || "")
        const field = item.field || item.major || ""
        const honor = item.honor || ""
        const details = Array.isArray(item.details) ? item.details : []

        if (!degree && !school) return null

        return {
            degree,
            school,
            location: loc,
            start,
            end,
            duration,
            field,
            honor,
            details,
        }
    }).filter(Boolean)

    // Projects
    const rawProj = data.projects || []
    const projects = (Array.isArray(rawProj) ? rawProj : []).map((item) => {
        if (!item || typeof item !== "object") return null
        const name = item.name || item.title || ""
        const link = item.link || item.url || ""
        const tech = item.technologies || item.tech || ""
        const desc = item.description || item.desc || ""
        if (!name && !desc) return null
        return {
            name,
            title: name,
            link,
            technologies: tech,
            description: desc,
        }
    }).filter(Boolean)

    // Certifications
    const rawCert = data.certifications || []
    const certifications = (Array.isArray(rawCert) ? rawCert : []).map((item) => {
        if (typeof item === "string" && item.trim()) return { name: item.trim(), issuer: "", date: "" }
        if (!item || typeof item !== "object") return null
        if (!item.name) return null
        return {
            name: item.name || "",
            issuer: item.issuer || item.organization || "",
            date: item.date || "",
        }
    }).filter(Boolean)

    const sections = data.sections || {}

    return {
        name: fullName,
        fullName,
        full_name: fullName,
        first_name: fullName.split(" ")[0] || "",
        last_name: fullName.split(" ").slice(1).join(" ") || "",
        title,
        job_title: title,
        email,
        phone,
        phone_cell: phone,
        phone_home: phone,
        location,
        address: location,
        linkedin,
        website,
        profile_url: website || linkedin || "#",
        profile_label: website || linkedin || "",
        summary: sections.summary !== false ? summary : "",
        summary_statement: sections.summary !== false ? summary : "",
        skills: sections.skills !== false ? skills : [],
        qualifications: sections.skills !== false ? skills : [],
        experience: sections.experience !== false ? experience : [],
        education: sections.education !== false ? education : [],
        projects: sections.projects !== false ? projects : [],
        certifications: sections.certifications !== false ? certifications : [],
        sections,
    }
}

function resolveLookup(ctx, path) {
    if (!path) return ""
    const parts = path.trim().split(".")
    let curr = ctx
    for (const p of parts) {
        if (curr && typeof curr === "object" && p in curr) {
            curr = curr[p]
        } else {
            return ""
        }
    }
    return curr
}

/**
 * Finds the exact matching closing tag for a given block type (e.g. "if", "unless", "each").
 * Correctly accounts for nested blocks of the same type.
 */
function findMatchingClose(template, type, startAfterOpenIdx) {
    let depth = 1
    let cursor = startAfterOpenIdx
    const openTag = `{{#${type}`
    const closeTag = `{{/${type}}}`

    while (cursor < template.length) {
        const nextOpenIdx = template.indexOf(openTag, cursor)
        const nextCloseIdx = template.indexOf(closeTag, cursor)

        if (nextCloseIdx === -1) return -1

        if (nextOpenIdx !== -1 && nextOpenIdx < nextCloseIdx) {
            depth++
            cursor = nextOpenIdx + openTag.length
        } else {
            depth--
            if (depth === 0) return nextCloseIdx
            cursor = nextCloseIdx + closeTag.length
        }
    }
    return -1
}

function renderHtmlList(items, tag = "ul", listClass = "qual-list", itemClass = "") {
    if (!items || !items.length) return ""
    const lis = items.map((i) => `<li${itemClass ? ` class="${itemClass}"` : ""}>${escapeHtml(i)}</li>`).join("")
    return `<${tag}${listClass ? ` class="${listClass}"` : ""}>${lis}</${tag}>`
}

function renderDefaultExperience(experience) {
    if (!experience || !experience.length) return ""
    return experience.map((exp) => {
        const dateHtml = exp.duration ? `<div class="resume-entry-date">${escapeHtml(exp.duration)}</div>` : ""
        let sub = escapeHtml(exp.company || "")
        if (exp.location) sub += ` &mdash; ${escapeHtml(exp.location)}`
        const descHtml = exp.description ? `<div class="resume-entry-desc">${escapeHtml(exp.description)}</div>` : ""

        return `
        <div class="resume-entry">
            <div class="resume-entry-top">
                <div>
                    <div class="resume-entry-title">${escapeHtml(exp.role || "")}</div>
                    <div class="resume-entry-sub">${sub}</div>
                </div>
                ${dateHtml}
            </div>
            ${descHtml}
        </div>`
    }).join("\n")
}

function renderDefaultEducation(education) {
    if (!education || !education.length) return ""
    return education.map((edu) => {
        const dateHtml = edu.duration ? `<div class="resume-entry-date">${escapeHtml(edu.duration)}</div>` : ""
        let sub = escapeHtml(edu.school || "")
        if (edu.location) sub += ` &mdash; ${escapeHtml(edu.location)}`

        return `
        <div class="resume-entry">
            <div class="resume-entry-top">
                <div>
                    <div class="resume-entry-title">${escapeHtml(edu.degree || "")}</div>
                    <div class="resume-entry-sub">${sub}</div>
                </div>
                ${dateHtml}
            </div>
        </div>`
    }).join("\n")
}

function renderDefaultProjects(projects) {
    if (!projects || !projects.length) return ""
    return projects.map((proj) => {
        const linkHtml = proj.link ? `<a class="resume-entry-date" href="${escapeHtml(proj.link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(proj.link)}</a>` : ""
        const descHtml = proj.description ? `<div class="resume-entry-desc">${escapeHtml(proj.description)}</div>` : ""
        const techHtml = proj.technologies ? `<div class="resume-project-tech"><strong>Technologies:</strong> ${escapeHtml(proj.technologies)}</div>` : ""

        return `
        <div class="resume-entry">
            <div class="resume-entry-top">
                <div class="resume-entry-title">${escapeHtml(proj.name || "")}</div>
                ${linkHtml}
            </div>
            ${descHtml}
            ${techHtml}
        </div>`
    }).join("\n")
}

function renderDefaultCertifications(certifications) {
    if (!certifications || !certifications.length) return ""
    return certifications.map((cert) => {
        const dateHtml = cert.date ? `<div class="resume-entry-date">${escapeHtml(cert.date)}</div>` : ""
        const issuerHtml = cert.issuer ? `<div class="resume-entry-sub">${escapeHtml(cert.issuer)}</div>` : ""

        return `
        <div class="resume-entry">
            <div class="resume-entry-top">
                <div>
                    <div class="resume-entry-title">${escapeHtml(cert.name || "")}</div>
                    ${issuerHtml}
                </div>
                ${dateHtml}
            </div>
        </div>`
    }).join("\n")
}

/**
 * Recursive block parser.
 * Handles nested {{#if}}, {{#unless}}, {{#each}} cleanly with zero mismatched tag leakage.
 */
function renderBlock(template, ctx) {
    let result = ""
    let cursor = 0

    while (cursor < template.length) {
        const openIdx = template.indexOf("{{#", cursor)
        if (openIdx === -1) {
            result += template.slice(cursor)
            break
        }

        result += template.slice(cursor, openIdx)

        const tagEndIdx = template.indexOf("}}", openIdx)
        if (tagEndIdx === -1) {
            result += template.slice(openIdx)
            break
        }

        const tagContent = template.slice(openIdx + 3, tagEndIdx).trim()
        const spaceIdx = tagContent.indexOf(" ")
        const type = spaceIdx !== -1 ? tagContent.slice(0, spaceIdx).trim() : tagContent
        const expr = spaceIdx !== -1 ? tagContent.slice(spaceIdx + 1).trim() : ""

        const closeStart = tagEndIdx + 2
        const closeEnd = findMatchingClose(template, type, closeStart)

        if (closeEnd === -1) {
            // No matching closing tag found, skip opening tag
            cursor = tagEndIdx + 2
            continue
        }

        const innerTemplate = template.slice(closeStart, closeEnd)
        cursor = closeEnd + `{{/${type}}}`.length

        if (type === "if") {
            const val = resolveLookup(ctx, expr)
            const isTruthy = val && (!Array.isArray(val) || val.length > 0) && (typeof val !== "object" || Object.keys(val).length > 0)
            if (isTruthy) {
                result += renderBlock(innerTemplate, ctx)
            }
        } else if (type === "unless") {
            const val = resolveLookup(ctx, expr)
            const isTruthy = val && (!Array.isArray(val) || val.length > 0) && (typeof val !== "object" || Object.keys(val).length > 0)
            if (!isTruthy) {
                result += renderBlock(innerTemplate, ctx)
            }
        } else if (type === "each") {
            const items = resolveLookup(ctx, expr)
            if (Array.isArray(items)) {
                for (const item of items) {
                    const itemCtx = typeof item === "object" && item !== null
                        ? { ...ctx, ...item, this: item }
                        : { ...ctx, this: item }
                    result += renderBlock(innerTemplate, itemCtx)
                }
            }
        }
    }

    // Standalone section shortcuts
    if (result.includes("{{skills}}") || result.includes("{{qualifications}}")) {
        const skillsHtml = renderHtmlList(ctx.skills, "ul", "qual-list")
        result = result.replace(/\{\{skills\}\}/g, skillsHtml).replace(/\{\{qualifications\}\}/g, skillsHtml)
    }

    if (result.includes("{{experience}}") || result.includes("{{work_experience}}")) {
        const expHtml = renderDefaultExperience(ctx.experience)
        result = result.replace(/\{\{experience\}\}/g, expHtml).replace(/\{\{work_experience\}\}/g, expHtml)
    }

    if (result.includes("{{education}}")) {
        const eduHtml = renderDefaultEducation(ctx.education)
        result = result.replace(/\{\{education\}\}/g, eduHtml)
    }

    if (result.includes("{{projects}}")) {
        const projHtml = renderDefaultProjects(ctx.projects)
        result = result.replace(/\{\{projects\}\}/g, projHtml)
    }

    if (result.includes("{{certifications}}")) {
        const certHtml = renderDefaultCertifications(ctx.certifications)
        result = result.replace(/\{\{certifications\}\}/g, certHtml)
    }

    // Replace scalar placeholders {{key}}
    return result.replace(/\{\{([a-zA-Z0-9_.]+)\}\}/g, (_, key) => {
        const k = key.trim()
        if (k === "this") {
            return escapeHtml(ctx.this)
        }
        const val = resolveLookup(ctx, k)
        if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
            return escapeHtml(val)
        }
        return ""
    })
}

/**
 * Main export: Renders template HTML with resume data.
 */
export function renderResumeHtml(templateHtml, resumeData) {
    if (!templateHtml) return ""
    const ctx = normalizeResumeData(resumeData)
    return renderBlock(templateHtml, ctx)
}
