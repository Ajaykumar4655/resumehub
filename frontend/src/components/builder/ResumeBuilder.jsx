import { useState, useEffect, useMemo, useCallback } from 'react'
import '../../assets/style/builder/resumeBuilder.css'
import ResumePreview from './ResumePreview'
import ScaledPreview from './ScaledPreview'
import Button from '../Button'
import axiosInstance from '../../axiosInstance'

const TABS = [
    { id: "personal", label: "Personal" },
    { id: "summary", label: "Summary" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "certifications", label: "Certifications" },
]

const emptyExperience = () => ({
    id: crypto.randomUUID(),
    role: "",
    company: "",
    location: "",
    start: "",
    end: "",
    current: false,
    description: "",
})

const emptyEducation = () => ({
    id: crypto.randomUUID(),
    degree: "",
    school: "",
    location: "",
    start: "",
    end: "",
})

const emptyProject = () => ({
    id: crypto.randomUUID(),
    name: "",
    link: "",
    technologies: "",
    description: "",
})

const emptyCertification = () => ({
    id: crypto.randomUUID(),
    name: "",
    issuer: "",
    date: "",
})

// Realistic sample data for template selector cards
const SAMPLE_DATA = {
    personal: {
        fullName: "Rahul Patel",
        title: "Senior Full Stack Engineer",
        email: "rahul.patel@example.com",
        phone: "+91 98765 43210",
        location: "Ahmedabad, India",
        linkedin: "linkedin.com/in/rahulpatel",
        website: "github.com/rahulpatel",
    },
    summary: "Results-driven Software Engineer with 5+ years of experience designing and building scalable web applications with Django and React. Delivered production-grade solutions serving 10k+ users.",
    experience: [
        {
            id: "sample-exp-1",
            role: "Senior Full Stack Engineer",
            company: "Tech Solutions Pvt Ltd",
            location: "Ahmedabad, India",
            start: "Jan 2023",
            end: "Present",
            current: true,
            description: "Architected RESTful APIs and responsive web apps with React & Django. Led a team of 5 engineers.",
        },
        {
            id: "sample-exp-2",
            role: "Software Developer",
            company: "Innovate Labs",
            location: "Ahmedabad, India",
            start: "Jun 2021",
            end: "Dec 2022",
            current: false,
            description: "Built microservices with Python and deployed on AWS. Improved system performance by 40%.",
        },
    ],
    education: [
        {
            id: "sample-edu-1",
            degree: "B.Tech in Computer Science",
            school: "Gujarat Technological University",
            location: "Ahmedabad, India",
            start: "2019",
            end: "2023",
        },
    ],
    skills: ["Python", "Django", "React", "JavaScript", "REST APIs", "PostgreSQL", "Git", "Docker"],
    projects: [
        {
            id: "sample-proj-1",
            name: "AI Resume Matcher & Builder",
            link: "https://github.com/rahulpatel/resume-ai",
            technologies: "Python, Django, React, Vite",
            description: "Full stack AI platform for resume analysis and dynamic single-page A4 PDF export.",
        },
    ],
    certifications: [
        { id: "sample-cert-1", name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", date: "2024" },
        { id: "sample-cert-2", name: "Google Cloud Professional", issuer: "Google", date: "2023" },
    ],
    sections: { summary: true, experience: true, education: true, projects: true, skills: true, certifications: true },
}

export default function ResumeBuilder() {
    const [templates, setTemplates] = useState([])
    const [loadingTemplates, setLoadingTemplates] = useState(true)
    const [templateError, setTemplateError] = useState(null)
    const [selectedTemplateId, setSelectedTemplateId] = useState(null)

    const [step, setStep] = useState(1) // 1: Choose Template, 2: Content & Live Preview, 3: Full Screen Preview
    const [activeTab, setActiveTab] = useState("personal")
    const [skillInput, setSkillInput] = useState("")

    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
    const [pdfError, setPdfError] = useState(null)
    const [pdfSuccess, setPdfSuccess] = useState(false)

    const [data, setData] = useState({
        personal: {
            fullName: "",
            title: "",
            email: "",
            phone: "",
            location: "",
            linkedin: "",
            website: "",
        },
        summary: "",
        experience: [emptyExperience()],
        education: [emptyEducation()],
        skills: [],
        projects: [emptyProject()],
        certifications: [emptyCertification()],
        sections: {
            summary: true,
            experience: true,
            education: true,
            projects: true,
            skills: true,
            certifications: true,
        },
    })

    // Fetch templates from Django API on mount
    const fetchTemplates = useCallback(async () => {
        setLoadingTemplates(true)
        setTemplateError(null)
        try {
            const res = await axiosInstance.get('/resume-templates/')
            const list = Array.isArray(res.data) ? res.data : []
            setTemplates(list)
            if (list.length > 0 && !selectedTemplateId) {
                setSelectedTemplateId(list[0].id)
            }
        } catch (err) {
            console.error("Error fetching resume templates:", err)
            setTemplateError(
                err.response?.data?.error ||
                "Failed to load resume templates from server. Please check your backend connection."
            )
        } finally {
            setLoadingTemplates(false)
        }
    }, [selectedTemplateId])

    useEffect(() => {
        fetchTemplates()
    }, [fetchTemplates])

    // Find currently selected template object
    const selectedTemplate = useMemo(() => {
        if (!templates.length) return null
        return templates.find((t) => t.id === selectedTemplateId) || templates[0]
    }, [templates, selectedTemplateId])

    // Form mutation helpers
    const toggleSection = (key) => {
        setData((prev) => ({
            ...prev,
            sections: { ...prev.sections, [key]: !prev.sections[key] },
        }))
    }

    const updatePersonal = (field, value) => {
        setData((prev) => ({
            ...prev,
            personal: { ...prev.personal, [field]: value },
        }))
    }

    const handlePhoneChange = (e) => {
        const cleaned = e.target.value.replace(/[^0-9+\-() ]/g, "")
        updatePersonal("phone", cleaned)
    }

    const updateListItem = (listName, id, field, value) => {
        setData((prev) => ({
            ...prev,
            [listName]: prev[listName].map((item) => (item.id === id ? { ...item, [field]: value } : item)),
        }))
    }

    const addListItem = (listName, factory) => {
        setData((prev) => ({
            ...prev,
            [listName]: [...prev[listName], factory()],
        }))
    }

    const removeListItem = (listName, id) => {
        setData((prev) => ({
            ...prev,
            [listName]: prev[listName].filter((item) => item.id !== id),
        }))
    }

    const addSkill = () => {
        const value = skillInput.trim()
        if (value && !data.skills.includes(value)) {
            setData((prev) => ({ ...prev, skills: [...prev.skills, value] }))
        }
        setSkillInput("")
    }

    const removeSkill = (skill) => {
        setData((prev) => ({
            ...prev,
            skills: prev.skills.filter((s) => s !== skill),
        }))
    }

    const handleSkillKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            addSkill()
        }
    }

    const goToStep = (n) => {
        setStep(n)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    // PDF Generation & Download via Django API (Single Page A4)
    const handleGeneratePdf = async () => {
        if (!selectedTemplate) {
            setPdfError("Please select a template first.")
            return
        }

        setIsGeneratingPdf(true)
        setPdfError(null)
        setPdfSuccess(false)

        try {
            const response = await axiosInstance.post(
                '/resumes/generate-pdf/',
                {
                    template_id: selectedTemplate.id,
                    resume_data: data,
                },
                {
                    responseType: 'blob',
                }
            )

            // Validate received blob
            const blob = new Blob([response.data], { type: 'application/pdf' })
            if (blob.size === 0) {
                throw new Error("Received empty PDF file from server.")
            }

            const url = window.URL.createObjectURL(blob)
            setPdfSuccess(true)

            // Trigger immediate single page download
            const link = document.createElement('a')
            link.href = url
            const safeName = (data.personal.fullName || "resume").trim().replace(/[^a-zA-Z0-9_-]/g, "_")
            link.setAttribute('download', `${safeName}_resume.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (err) {
            console.error("PDF generation error:", err)
            let msg = "Failed to generate PDF. Please try again."
            if (err.response && err.response.data instanceof Blob) {
                try {
                    const text = await err.response.data.text()
                    const json = JSON.parse(text)
                    if (json.error) msg = json.error
                } catch {
                    // ignore parse error
                }
            } else if (err.message) {
                msg = err.message
            }
            setPdfError(msg)
        } finally {
            setIsGeneratingPdf(false)
        }
    }

    return (
        <main className="builder-page" style={{ maxWidth: "1300px"}}>
            {/* Header */}
            <div className="builder-header">
                <div>
                    <h1>Resume Builder</h1>
                    <p>Select a professional template, fill your details, and download a single-page A4 PDF.</p>
                </div>
                <div style={{ margin: "auto 0", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <Button name="← Dashboard" url="/dashboard" className="btn btn-outline" />
                </div>
            </div>

            {/* Step Navigation Bar */}
            <div className="builder-steps">
                <button
                    type="button"
                    className={`builder-step ${step === 1 ? "active" : step > 1 ? "done" : ""}`}
                    onClick={() => goToStep(1)}
                >
                    <span className="num">{step > 1 ? "✓" : "1"}</span> 1. Select Template
                </button>
                <div className="builder-step-sep" />
                <button
                    type="button"
                    className={`builder-step ${step === 2 ? "active" : step > 2 ? "done" : ""}`}
                    onClick={() => goToStep(2)}
                >
                    <span className="num">{step > 2 ? "✓" : "2"}</span> 2. Fill Content & Live Preview
                </button>
                <div className="builder-step-sep" />
                <button
                    type="button"
                    className={`builder-step ${step === 3 ? "active" : ""}`}
                    onClick={() => goToStep(3)}
                >
                    <span className="num">3</span> 3. Full Preview & Download
                </button>
            </div>

            {/* Notification & Alerts */}
            {pdfError && (
                <div className="builder-alert builder-alert-error">
                    <span>⚠️ {pdfError}</span>
                    <button type="button" onClick={() => setPdfError(null)}>✕</button>
                </div>
            )}
            {pdfSuccess && (
                <div className="builder-alert builder-alert-success">
                    <span>✅ Single-page A4 PDF successfully generated and downloaded!</span>
                    <button type="button" onClick={() => setPdfSuccess(false)}>✕</button>
                </div>
            )}

            {/* =========================== STEP 1 — Template Selection =========================== */}
            {step === 1 && (
                <div className="template-selection-view">
                    <div className="template-selection-header">
                        <h2>Choose a Resume Template</h2>
                        <p>Pick a template formatted for a clean, professional single-page A4 resume.</p>
                    </div>

                    {loadingTemplates && (
                        <div className="template-loading-state">
                            <div className="spinner"></div>
                            <p>Loading resume templates from server...</p>
                        </div>
                    )}

                    {templateError && (
                        <div className="template-error-state">
                            <p className="error-text">{templateError}</p>
                            <button type="button" className="btn btn-primary" onClick={fetchTemplates}>
                                ↻ Try Again
                            </button>
                        </div>
                    )}

                    {!loadingTemplates && !templateError && templates.length === 0 && (
                        <div className="template-empty-state">
                            <p>No resume templates found. Please add templates in Django Admin.</p>
                            <button type="button" className="btn btn-primary" onClick={fetchTemplates}>
                                ↻ Refresh
                            </button>
                        </div>
                    )}

                    {!loadingTemplates && templates.length > 0 && (
                        <>
                            <div className="template-grid">
                                {templates.map((t) => {
                                    const isSelected = selectedTemplateId === t.id
                                    return (
                                        <div
                                            key={t.id}
                                            className={`template-card ${isSelected ? "selected" : ""}`}
                                            onClick={() => setSelectedTemplateId(t.id)}
                                        >
                                            {isSelected && <span className="template-check">✓ Selected</span>}

                                            <div className="template-preview-frame">
                                                {t.preview_image ? (
                                                    <img
                                                        src={t.preview_image}
                                                        alt={t.name}
                                                        className="template-img-thumb"
                                                    />
                                                ) : (
                                                    <ScaledPreview scale={0.40}>
                                                        <ResumePreview data={SAMPLE_DATA} template={t} />
                                                    </ScaledPreview>
                                                )}
                                            </div>

                                            <div className="template-card-footer">
                                                <h4>{t.name}</h4>
                                                <button
                                                    type="button"
                                                    className={`btn btn-sm ${isSelected ? "btn-primary" : "btn-outline"}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setSelectedTemplateId(t.id)
                                                        goToStep(2)
                                                    }}
                                                >
                                                    {isSelected ? "Use Template →" : "Select"}
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                        </>
                    )}
                </div>
            )}

            {/* =========================== STEP 2 — Content Form + Live Preview =========================== */}
            {step === 2 && (
                <div className="builder-content-layout">
                    {/* LEFT COLUMN: Clean Resume Form (Red-line features removed) */}
                    <div className="card builder-form-card">
                        {/* Clean Navigation Tabs */}
                        <div className="tabs">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="builder-form-body">
                            {/* Personal Info Tab */}
                            {activeTab === "personal" && (
                                <div className="form-section">
                                    <div className="grid-2">
                                        <div className="form-group">
                                            <label className="form-label">Full Name *</label>
                                            <input
                                                className="form-input"
                                                value={data.personal.fullName}
                                                onChange={(e) => updatePersonal("fullName", e.target.value)}
                                                placeholder="e.g. Rahul Patel"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Professional Title</label>
                                            <input
                                                className="form-input"
                                                value={data.personal.title}
                                                onChange={(e) => updatePersonal("title", e.target.value)}
                                                placeholder="e.g. Full Stack Developer"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid-2">
                                        <div className="form-group">
                                            <label className="form-label">Email Address *</label>
                                            <input
                                                className="form-input"
                                                type="email"
                                                value={data.personal.email}
                                                onChange={(e) => updatePersonal("email", e.target.value)}
                                                placeholder="rahul@example.com"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Phone Number</label>
                                            <input
                                                className="form-input"
                                                type="tel"
                                                value={data.personal.phone}
                                                onChange={handlePhoneChange}
                                                maxLength={25}
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid-2">
                                        <div className="form-group">
                                            <label className="form-label">City, Country</label>
                                            <input
                                                className="form-input"
                                                value={data.personal.location}
                                                onChange={(e) => updatePersonal("location", e.target.value)}
                                                placeholder="Ahmedabad, India"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">LinkedIn Profile <span style={{color:'#0d9488',fontSize:'0.75rem'}}>↗ Becomes a clickable link</span></label>
                                            <input
                                                className="form-input"
                                                value={data.personal.linkedin}
                                                onChange={(e) => updatePersonal("linkedin", e.target.value)}
                                                placeholder="linkedin.com/in/yourname"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Portfolio / GitHub / Website <span style={{color:'#0d9488',fontSize:'0.75rem'}}>↗ Becomes a clickable link</span></label>
                                        <input
                                            className="form-input"
                                            value={data.personal.website}
                                            onChange={(e) => updatePersonal("website", e.target.value)}
                                            placeholder="github.com/yourname"
                                        />
                                        <div className="form-hint">Enter URL without https:// — links open automatically in the resume.</div>
                                    </div>
                                </div>
                            )}

                            {/* Summary Tab */}
                            {activeTab === "summary" && (
                                <div className="form-section">
                                    <div className="checkbox-row section-toggle">
                                        <input
                                            type="checkbox"
                                            id="toggle-summary"
                                            checked={data.sections.summary}
                                            onChange={() => toggleSection("summary")}
                                        />
                                        <label htmlFor="toggle-summary">Include Summary in Resume</label>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Professional Summary</label>
                                        <textarea
                                            className="form-textarea"
                                            style={{ minHeight: "160px" }}
                                            value={data.summary}
                                            onChange={(e) => setData((prev) => ({ ...prev, summary: e.target.value }))}
                                            placeholder="2-4 impactful sentences summarizing your key experience, strengths, and achievements."
                                        />
                                        <div className="form-hint">Keep it concise (2-3 sentences) so your resume fits comfortably on 1 single page.</div>
                                    </div>
                                </div>
                            )}

                            {/* Experience Tab */}
                            {activeTab === "experience" && (
                                <div className="form-section">
                                    <div className="checkbox-row section-toggle">
                                        <input
                                            type="checkbox"
                                            id="toggle-experience"
                                            checked={data.sections.experience}
                                            onChange={() => toggleSection("experience")}
                                        />
                                        <label htmlFor="toggle-experience">Include Work Experience in Resume</label>
                                    </div>

                                    {data.experience.map((exp, i) => (
                                        <div key={exp.id} className="repeatable-item">
                                            <div className="repeatable-item-head">
                                                <span>Work Experience #{i + 1}</span>
                                                {data.experience.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="remove-item-btn"
                                                        onClick={() => removeListItem("experience", exp.id)}
                                                    >
                                                        ✕ Remove
                                                    </button>
                                                )}
                                            </div>
                                            <div className="grid-2">
                                                <div className="form-group">
                                                    <label className="form-label">Role / Job Title</label>
                                                    <input
                                                        className="form-input"
                                                        value={exp.role}
                                                        onChange={(e) => updateListItem("experience", exp.id, "role", e.target.value)}
                                                        placeholder="e.g. Software Engineer"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Company Name</label>
                                                    <input
                                                        className="form-input"
                                                        value={exp.company}
                                                        onChange={(e) => updateListItem("experience", exp.id, "company", e.target.value)}
                                                        placeholder="e.g. Google"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid-2">
                                                <div className="form-group">
                                                    <label className="form-label">Location</label>
                                                    <input
                                                        className="form-input"
                                                        value={exp.location}
                                                        onChange={(e) => updateListItem("experience", exp.id, "location", e.target.value)}
                                                        placeholder="City, Country or Remote"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Start &mdash; End Date</label>
                                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                                        <input
                                                            className="form-input"
                                                            value={exp.start}
                                                            onChange={(e) => updateListItem("experience", exp.id, "start", e.target.value)}
                                                            placeholder="Jan 2022"
                                                        />
                                                        <input
                                                            className="form-input"
                                                            value={exp.end}
                                                            disabled={exp.current}
                                                            onChange={(e) => updateListItem("experience", exp.id, "end", e.target.value)}
                                                            placeholder={exp.current ? "Present" : "Dec 2024"}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="checkbox-row">
                                                <input
                                                    type="checkbox"
                                                    id={`current-${exp.id}`}
                                                    checked={exp.current}
                                                    onChange={(e) => updateListItem("experience", exp.id, "current", e.target.checked)}
                                                />
                                                <label htmlFor={`current-${exp.id}`}>I currently work here</label>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Responsibilities & Achievements</label>
                                                <textarea
                                                    className="form-textarea"
                                                    style={{ minHeight: "85px" }}
                                                    value={exp.description}
                                                    onChange={(e) => updateListItem("experience", exp.id, "description", e.target.value)}
                                                    placeholder="Key achievements and responsibilities..."
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="add-item-btn"
                                        onClick={() => addListItem("experience", emptyExperience)}
                                    >
                                        + Add Another Role
                                    </button>
                                </div>
                            )}

                            {/* Education Tab */}
                            {activeTab === "education" && (
                                <div className="form-section">
                                    <div className="checkbox-row section-toggle">
                                        <input
                                            type="checkbox"
                                            id="toggle-education"
                                            checked={data.sections.education}
                                            onChange={() => toggleSection("education")}
                                        />
                                        <label htmlFor="toggle-education">Include Education in Resume</label>
                                    </div>

                                    {data.education.map((edu, i) => (
                                        <div key={edu.id} className="repeatable-item">
                                            <div className="repeatable-item-head">
                                                <span>Education #{i + 1}</span>
                                                {data.education.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="remove-item-btn"
                                                        onClick={() => removeListItem("education", edu.id)}
                                                    >
                                                        ✕ Remove
                                                    </button>
                                                )}
                                            </div>
                                            <div className="grid-2">
                                                <div className="form-group">
                                                    <label className="form-label">Degree / Qualification</label>
                                                    <input
                                                        className="form-input"
                                                        value={edu.degree}
                                                        onChange={(e) => updateListItem("education", edu.id, "degree", e.target.value)}
                                                        placeholder="e.g. B.Tech Computer Science"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">School / University</label>
                                                    <input
                                                        className="form-input"
                                                        value={edu.school}
                                                        onChange={(e) => updateListItem("education", edu.id, "school", e.target.value)}
                                                        placeholder="e.g. Gujarat Technological University"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid-2">
                                                <div className="form-group">
                                                    <label className="form-label">Location</label>
                                                    <input
                                                        className="form-input"
                                                        value={edu.location}
                                                        onChange={(e) => updateListItem("education", edu.id, "location", e.target.value)}
                                                        placeholder="Ahmedabad, India"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Start &mdash; End Year</label>
                                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                                        <input
                                                            className="form-input"
                                                            value={edu.start}
                                                            onChange={(e) => updateListItem("education", edu.id, "start", e.target.value)}
                                                            placeholder="2019"
                                                        />
                                                        <input
                                                            className="form-input"
                                                            value={edu.end}
                                                            onChange={(e) => updateListItem("education", edu.id, "end", e.target.value)}
                                                            placeholder="2023"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="add-item-btn"
                                        onClick={() => addListItem("education", emptyEducation)}
                                    >
                                        + Add Another Degree
                                    </button>
                                </div>
                            )}

                            {/* Projects Tab */}
                            {activeTab === "projects" && (
                                <div className="form-section">
                                    <div className="checkbox-row section-toggle">
                                        <input
                                            type="checkbox"
                                            id="toggle-projects"
                                            checked={data.sections.projects}
                                            onChange={() => toggleSection("projects")}
                                        />
                                        <label htmlFor="toggle-projects">Include Projects in Resume</label>
                                    </div>

                                    {data.projects.map((proj, i) => (
                                        <div key={proj.id} className="repeatable-item">
                                            <div className="repeatable-item-head">
                                                <span>Project #{i + 1}</span>
                                                {data.projects.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="remove-item-btn"
                                                        onClick={() => removeListItem("projects", proj.id)}
                                                    >
                                                        ✕ Remove
                                                    </button>
                                                )}
                                            </div>
                                            <div className="grid-2">
                                                <div className="form-group">
                                                    <label className="form-label">Project Name</label>
                                                    <input
                                                        className="form-input"
                                                        value={proj.name}
                                                        onChange={(e) => updateListItem("projects", proj.id, "name", e.target.value)}
                                                        placeholder="e.g. AI Resume Builder"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Project URL / GitHub</label>
                                                    <input
                                                        className="form-input"
                                                        value={proj.link}
                                                        onChange={(e) => updateListItem("projects", proj.id, "link", e.target.value)}
                                                        placeholder="https://github.com/you/project"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Technologies Used</label>
                                                <input
                                                    className="form-input"
                                                    value={proj.technologies}
                                                    onChange={(e) => updateListItem("projects", proj.id, "technologies", e.target.value)}
                                                    placeholder="React, Django, PostgreSQL, Docker"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Description & Highlights</label>
                                                <textarea
                                                    className="form-textarea"
                                                    style={{ minHeight: "80px" }}
                                                    value={proj.description}
                                                    onChange={(e) => updateListItem("projects", proj.id, "description", e.target.value)}
                                                    placeholder="Built an automated resume generation platform that exports single-page A4 PDFs..."
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="add-item-btn"
                                        onClick={() => addListItem("projects", emptyProject)}
                                    >
                                        + Add Another Project
                                    </button>
                                </div>
                            )}

                            {/* Skills Tab */}
                            {activeTab === "skills" && (
                                <div className="form-section">
                                    <div className="checkbox-row section-toggle">
                                        <input
                                            type="checkbox"
                                            id="toggle-skills"
                                            checked={data.sections.skills}
                                            onChange={() => toggleSection("skills")}
                                        />
                                        <label htmlFor="toggle-skills">Include Skills in Resume</label>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Add Skills</label>
                                        <div className="skills-input-row">
                                            <input
                                                className="form-input"
                                                value={skillInput}
                                                onChange={(e) => setSkillInput(e.target.value)}
                                                onKeyDown={handleSkillKeyDown}
                                                placeholder="Type a skill and press Enter or comma (e.g. Python)"
                                            />
                                            <button type="button" className="btn btn-outline" onClick={addSkill}>
                                                + Add
                                            </button>
                                        </div>

                                        <div className="skill-tag-list">
                                            {data.skills.length === 0 && (
                                                <div className="form-hint">No skills added yet. Type above to add your technical and soft skills.</div>
                                            )}
                                            {data.skills.map((skill) => (
                                                <span key={skill} className="skill-tag">
                                                    {skill}
                                                    <button type="button" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}>
                                                        ✕
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Certifications Tab */}
                            {activeTab === "certifications" && (
                                <div className="form-section">
                                    <div className="checkbox-row section-toggle">
                                        <input
                                            type="checkbox"
                                            id="toggle-certifications"
                                            checked={data.sections.certifications}
                                            onChange={() => toggleSection("certifications")}
                                        />
                                        <label htmlFor="toggle-certifications">Include Certifications in Resume</label>
                                    </div>

                                    {data.certifications.map((cert, i) => (
                                        <div key={cert.id} className="repeatable-item">
                                            <div className="repeatable-item-head">
                                                <span>Certification #{i + 1}</span>
                                                {data.certifications.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="remove-item-btn"
                                                        onClick={() => removeListItem("certifications", cert.id)}
                                                    >
                                                        ✕ Remove
                                                    </button>
                                                )}
                                            </div>
                                            <div className="grid-2">
                                                <div className="form-group">
                                                    <label className="form-label">Certification Name</label>
                                                    <input
                                                        className="form-input"
                                                        value={cert.name}
                                                        onChange={(e) => updateListItem("certifications", cert.id, "name", e.target.value)}
                                                        placeholder="e.g. AWS Certified Solutions Architect"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Issuing Organization</label>
                                                    <input
                                                        className="form-input"
                                                        value={cert.issuer}
                                                        onChange={(e) => updateListItem("certifications", cert.id, "issuer", e.target.value)}
                                                        placeholder="e.g. Amazon Web Services"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Date / Year Obtained</label>
                                                <input
                                                    className="form-input"
                                                    value={cert.date}
                                                    onChange={(e) => updateListItem("certifications", cert.id, "date", e.target.value)}
                                                    placeholder="e.g. 2024"
                                                    style={{ maxWidth: "220px" }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="add-item-btn"
                                        onClick={() => addListItem("certifications", emptyCertification)}
                                    >
                                        + Add Another Certification
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Clean Form Footer Action */}
                        <div className="form-card-footer">
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => goToStep(1)}
                            >
                                ← Change Template
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleGeneratePdf}
                                disabled={isGeneratingPdf}
                            >
                                {isGeneratingPdf ? "Generating..." : "⬇ Download PDF"}
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Clean Live A4 Resume Preview */}
                    <div className="live-preview-pane">
                        <div className="live-preview-viewport">
                            <ScaledPreview>
                                <ResumePreview data={data} template={selectedTemplate} />
                            </ScaledPreview>
                        </div>

                        <div className="live-preview-bottom-actions">
                            <button
                                type="button"
                                className="btn btn-outline btn-block"
                                onClick={() => goToStep(3)}
                            >
                                Full Screen Preview →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================== STEP 3 — Full Screen Preview & Download =========================== */}
            {step === 3 && (
                <div className="full-preview-view">
                    <div className="preview-toolbar">
                        <button type="button" className="btn btn-outline" onClick={() => goToStep(2)}>
                            ← Back to Editor
                        </button>

                        <button
                            type="button"
                            className="btn btn-primary btn-lg"
                            onClick={handleGeneratePdf}
                            disabled={isGeneratingPdf}
                        >
                            {isGeneratingPdf ? "Generating PDF..." : "⬇ Download Single-Page PDF"}
                        </button>
                    </div>

                    <div className="full-preview-stage">
                        <ResumePreview data={data} template={selectedTemplate} />
                    </div>
                </div>
            )}
        </main>
    )
}