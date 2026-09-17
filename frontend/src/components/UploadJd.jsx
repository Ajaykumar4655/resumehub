import { useState } from 'react'
import '../assets/style/uploadjd.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Button from './Button'

function UploadJd() {

    const url = import.meta.env.VITE_BACKEND_ROOT

    const [jobTitle, setJobTitle] = useState("Pasted JD")
    const [company, setCompany] = useState("Pasted JD")
    const [jdText, setJdText] = useState()
    const [errors, setErrors] = useState()
    const [errorDismissed, setErrorDismissed] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleUploadJd = async (e) => {
        e.preventDefault()
        setLoading(true)

        if (!jdText) {
            setErrors({ "message": "Enter job descriptions." })
            setErrorDismissed(false)
            setLoading(false)
        } else {
            const jdData = {
                jobTitle, company, jdText
            }

            try {
                const response = await axios.post(`${url}/upload-jd/`, jdData, { withCredentials: true })
                navigate("/result")
            } catch (error) {
                setErrors(error.response.data)
                setErrorDismissed(false)
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <main>

            <div className="uploadjd-header">
                <div>
                    <h1>Add Job Description</h1>
                    <p>Paste the job description text to compare it against your resume.</p>
                </div>
                <Button name="← Back" url="/upload-resume" className="btn btn-outline back" />
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

            <div className="jd-layout">
                <div>
                    <form onSubmit={handleUploadJd}>
                        <div className="card">

                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">Job Title (optional)</label>
                                    <input type="text" name="job_title" onChange={(e) => setJobTitle(e.target.value)} className="form-input" placeholder="e.g. Senior Product Designer" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Company (optional)</label>
                                    <input type="text" name="company" onChange={(e) => setCompany(e.target.value)} className="form-input" placeholder="e.g. TechFlow Inc." />
                                </div>
                            </div>

                            <span className="source-label">✏️ Paste Text</span>

                            <div className="form-group">
                                <label className="form-label">Paste Job Description Text</label>
                                <textarea
                                    onChange={(e) => setJdText(e.target.value)}
                                    name="jd_text_paste"
                                    className="form-textarea"
                                    placeholder="Paste the full job description here...&#10;&#10;Include requirements, responsibilities, qualifications, and preferred skills for best results."
                                    style={{ minHeight: "250px" }}
                                ></textarea>
                                <div className="form-hint">
                                    Aim for at least 200 characters for accurate results.
                                </div>
                            </div>

                            {loading ? (
                                <div className="loading-box">
                                    <div className="loading-spinner">⏳</div>
                                    <div className="loading-text">Running analysis with Gemini AI...</div>
                                </div>
                            ) : (
                                <button type="submit" className="btn btn-primary btn-lg btn-block">
                                    Analyze Resume →
                                </button>
                            )}

                        </div>
                    </form>
                </div>

                <div>
                    <div className="tip-card">
                        <h4>What to Include in JD</h4>
                        <div className="tip-item"><span className="tip-icon ok"></span> Job title and seniority level</div>
                        <div className="tip-item"><span className="tip-icon ok"></span> Required technical skills</div>
                        <div className="tip-item"><span className="tip-icon ok"></span> Years of experience required</div>
                        <div className="tip-item"><span className="tip-icon ok"></span> Preferred qualifications</div>
                        <div className="tip-item"><span className="tip-icon ok"></span> Responsibilities &amp; duties</div>
                        <div className="tip-item"><span className="tip-icon warn"></span> The more text, the more accurate the match</div>
                    </div>

                    <div className="tip-card">
                        <h4>What Happens Next</h4>
                        <div className="process-list">
                            <div className="process-item"><span className="process-num">1</span> Personal details are removed from your resume text</div>
                            <div className="process-item"><span className="process-num">2</span> Skills and keywords are extracted from both documents</div>
                            <div className="process-item"><span className="process-num">3</span> Google's Gemini AI analyzes the match in context</div>
                            <div className="process-item"><span className="process-num">4</span> A weighted ATS score is calculated</div>
                            <div className="process-item"><span className="process-num">5</span> Your results dashboard is generated</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default UploadJd