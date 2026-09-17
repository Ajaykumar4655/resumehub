import '../assets/style/uploadresume.css'
import { React, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function UploadResume() {

    const url = import.meta.env.VITE_BACKEND_ROOT
    const [resume, setResume] = useState()
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState()
    const [errorDismissed, setErrorDismissed] = useState(false)
    const navigate = useNavigate()

    const handleResume = async (e) => {
        e.preventDefault()
        setLoading(true)

        if (resume) {
            const fileSize = resume.size / (1024 * 1024)
            if (fileSize > 1) {
                setErrors({ "message": "File must be under 1 MB" })
                setErrorDismissed(false)
                setLoading(false)
            } else {

                const formData = new FormData()
                formData.append("resume", resume)

                try {
                    const response = await axios.post(`${url}/upload-resume/`, formData)
                    navigate("/upload-jd")
                } catch (error) {
                    setErrors(error.response.data)
                    setErrorDismissed(false)
                } finally {
                    setLoading(false)
                }
            }
        } else {
            setLoading(false)
            setErrors({ "message": "Upload Resume File." })
            setErrorDismissed(false)
        }

    }

    return (
        <main >

            <div className="upload-header">
                <div>
                    <h1>Upload Your Resume</h1>
                    <p>We'll extract the text and compare it against your job description.</p>
                </div>
            </div>

            {errors && !errorDismissed && (
                <div className="error-banner">
                    <span>{errors.message}</span>
                    <button
                        type="button"
                        className="close-btn"
                        aria-label="Close"
                        onClick={() => setErrorDismissed(true)}
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="upload-layout">

                <div>
                    <form method="post" onSubmit={handleResume}>

                        <div className="card">
                            <div className="form-group">
                                <label className="form-label">Resume File</label>
                                <div className={`file-drop ${resume ? 'file-selected' : ''}`}>
                                    <input type="file" name="resume" id="resumeFile" accept=".pdf,.docx,.txt" onChange={(e) => setResume(e.target.files[0])} required />
                                    {resume ? (<div className="file-drop-icon">✅</div>) : (<div className="file-drop-icon">📄</div>)}
                                    {resume ? (<div className="file-drop-title">{resume.name}</div>) : (<div className="file-drop-title">Drag &amp; drop your resume here</div>)}
                                    {resume ? (<div className="file-name-display">✓ File selected successfully</div>) : (<div className="file-drop-sub">or click to browse — PDF, DOCX, TXT supported</div>)}
                                </div>
                            </div>

                            <div className="info-banner">
                                <span>ℹ️</span>
                                <span>
                                    <strong>Supported formats:</strong> PDF (text-based) · DOCX (Word) · TXT (plain text)
                                    <br />Max file size: 1 MB
                                </span>
                            </div>

                            {loading ? (
                                <div className="loading-box">
                                    <div className="loading-spinner">⏳</div>
                                    <div className="loading-text">Extracting text from your resume...</div>
                                </div>
                            ) : (
                                <button type="submit" className="btn btn-primary btn-lg btn-block">
                                    Continue to Job Description →
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div>
                    <div className="tip-card">
                        <h4>Resume Tips for ATS</h4>
                        <div className="tip-item">Use a clean, single-column layout (no tables)</div>
                        <div className="tip-item">Include a dedicated Skills section</div>
                        <div className="tip-item">Match keywords directly from the job description</div>
                        <div className="tip-item">Spell out acronyms at least once</div>
                        <div className="tip-item">Use standard section headings (Education, Experience)</div>
                        <div className="tip-item">Avoid headers/footers for key information</div>
                        <div className="tip-item">Save as PDF with proper text (not scanned image)</div>
                    </div>

                    <div className="tip-card">
                        <h4>How Scoring Works</h4>

                        <div className="score-row">
                            <span className="score-name">🧠 AI Semantic Analysis (Gemini)</span>
                            <span className="score-pct">40%</span>
                        </div>

                        <div className="score-row">
                            <span className="score-name">🎯 Skill Overlap (Resume vs JD)</span>
                            <span className="score-pct">35%</span>
                        </div>

                        <div className="score-row">
                            <span className="score-name">🔍 Keyword Density</span>
                            <span className="score-pct">15%</span>
                        </div>

                        <div className="score-row">
                            <span className="score-name">📋 Section Completeness</span>
                            <span className="score-pct">10%</span>
                        </div>

                        <div className="score-footnote">
                            Your resume text is analyzed by Google's Gemini AI alongside skill and keyword matching — personal details are removed first, and your file is never stored.
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default UploadResume