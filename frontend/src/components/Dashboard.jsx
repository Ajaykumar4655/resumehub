import { useContext, useEffect, useState } from 'react'
import '../assets/style/dashboard.css'
import { AuthContext } from '../AuthProvider'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '.././axiosInstance'
import axios from 'axios'
import Button from './Button'

function Dashboard() {

    const [errors, setErrors] = useState()

    useEffect(() => {
        const fetchProtectedData = async () => {
            try {
                const response = await axiosInstance.get("/protected-view/")
            } catch (error) {
                setErrors(error.response)
            }
        }
        fetchProtectedData()
    }, [])

    const [resultHistory, setResultHistory] = useState(null)

    useEffect(() => {
        const url = import.meta.env.VITE_BACKEND_ROOT
        const fetchHistory = async () => {
            try {
                const response = await axios.get(`${url}/dashboard/`, { withCredentials: true })
                setResultHistory(response.data)
            } catch (error) {
                setErrors(error.response)
            }
        }
        fetchHistory()
    }, [])

    const [username, setUserName] = useState()
    const [totalAnalyzed, setTotalAnalyzed] = useState(0)

    useEffect(() => {
        if (!resultHistory || resultHistory.length === 0) { return }
        const username = resultHistory.username.charAt(0).toUpperCase() + resultHistory.username.slice(1)
        setUserName(username)
        setTotalAnalyzed(resultHistory.total_analyzed)
    }, [resultHistory])

    const getBgColor = (score) => {
        if (score >= 85) return "var(--green)";
        if (score >= 65) return "var(--blue)";
        if (score >= 50) return "var(--yellow)";
        return "var(--red)";
    }

    const getIcon = (score) => {
        if (score >= 80) return "🏆";
        if (score >= 60) return "🎯";
        if (score >= 40) return "📄";
        return "⚠️";
    }

    const getIconColor = (score) => {
        if (score >= 80) return "var(--green-bg)";
        if (score >= 60) return "#e9f0ff";
        if (score >= 40) return "var(--yellow-bg)";
        return "var(--red-bg)";
    }

    const [errorDismissed, setErrorDismissed] = useState(false)

    return (
        <>
            <main style={{ minHeight: "80vh" }}>
                {errors ? (
                    <div style={{ minHeight: "70vh", bottom: "0" }}>
                        <div className="error-banner" >
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
                    </div>
                ) : (
                    <>
                        <div className="dash-header">
                            <div>
                                <h1>Welcome back, {username} </h1>
                                <p>Here is a summary of your resume analyses and insights.</p>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "25vw" }}>
                                <Button url="/upload-resume" name="+ New Analysis" className="btn btn-outline" />
                                <Button url="/resume-builder" name="📄 Resume Builder" className="btn btn-outline" />
                            </div>
                        </div>

                        <div className="card recent-card">
                            <div className="recent-card-header">
                                <h2>Recent Analyses ({totalAnalyzed})</h2>
                                <Button url="/recent-history" name="View All →" />
                            </div>
                            {resultHistory && resultHistory.result.length > 0 ? (
                                (resultHistory.result).map((s) => (
                                    <>
                                        <div className="recent-row" key={s.id}>
                                            <div className="recent-icon" style={{ background: getIconColor(s.score) }} >
                                                {getIcon(s.score)}
                                            </div>
                                            <div className="recent-info">
                                                <div className="recent-title" >{s.resume}</div>
                                                <div className="recent-sub" >{s.job_title || "Pasted JD"} &middot; {new Date(s.created_at).toLocaleDateString() || "0/0/0000"}</div>
                                            </div>
                                            <div className="recent-score">
                                                <div className="val" style={{ color: getBgColor(s.score) }} >{s.score}%</div>
                                            </div>
                                            <Button url="/result" name=">" className="recent-chevron" state={{ "id": s.id }} />
                                        </div>
                                    </>
                                ))
                            ) : (<div className="empty-state">
                                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📋</div>
                                <h3 style={{ color: "var(--text2)", marginBottom: "0.5rem" }}>No analyses yet</h3>
                                <p style={{ marginBottom: "1.5rem" }}>Upload your first resume to get your ATS match score.</p>
                                <Button url="/upload-resume" name="+ New Analysis" className="btn btn-primary" />
                            </div>)}
                        </div >
                    </>
                )}
            </main >
        </>
    )
}

export default Dashboard