import { useEffect, useState } from 'react'
import "../assets/style/recent_history.css"
import Button from './Button'
import axios from 'axios'
import eye from '../assets/img/eye.png'
import remove from '../assets/img/delete.png'

function RecentHistory() {

    const [recentHistory, setRecentHistory] = useState(null)
    const [errors, setErrors] = useState()
    const url = import.meta.env.VITE_BACKEND_ROOT

    const fetchHistory = async () => {
        try {
            const response = await axios.get(`${url}/recent-history/`, { withCredentials: true })
            setRecentHistory(response.data)
        } catch (error) {
            setErrors(error.response)
        }
    }

    useEffect(() => {
        fetchHistory()
    }, [])

    const deleteResult = async (id) => {
        try {
            const response = await axios.delete(`${url}/result/${id}/`, { withCredentials: true });
            fetchHistory();
        } catch (error) {
            setErrors(error.response)
        }
    }

    const getBgColor = (score) => {
        if (score >= 85) return "var(--green)";
        if (score >= 65) return "var(--blue)";
        if (score >= 50) return "var(--yellow)";
        return "var(--red)";
    }

    return (
        <>
            <main style={{ minHeight: "80vh" }}>
                <div className="history-header">
                    <div >
                        <h1 style={{ fontSize: "1.8rem", fontWeight: "800" }}>Analysis History</h1>
                    </div>
                    <Button name="← Back" url="/dashboard" className="btn btn-outline back" />
                </div>

                {recentHistory?.result?.length > 0 ? (
                    <div className="card" style={{ padding: "0", overflow: "hidden" }}>
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Resume</th>
                                    <th>Job Description</th>
                                    <th>ATS Score</th>
                                    <th>Date</th>
                                    <th>View Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentHistory.result.map((history, id) => (
                                    <>

                                        <tr className="link-row" key={id}>
                                            <td><div style={{ fontWeight: "700", color: "var(--text)" }}>{history.resume}</div></td>
                                            <td><div style={{ fontWeight: "700", color: "var(--text2)" }}>{history.job_title} </div></td>
                                            <td>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                    <div className="ats-circle" style={{ color: getBgColor(history.score) }}>
                                                        {history.score}%
                                                    </div>
                                                </div>
                                            </td>

                                            <td style={{ color: "var(--text3)", whiteSpace: "nowrap", fontWeight: "200" }}>
                                                {new Date(history.created_at).toLocaleDateString() || "0/0/0000"}<br />
                                                <span style={{ fontSize: "0.78rem" }}>{new Date(history.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </td>
                                            <td>
                                                <Button name={<img src={eye} style={{ height: "4vh", marginRight: "10px" }} />} url="/result" state={{ "id": history.id }} />
                                                <button type='submit' onClick={(e) => deleteResult(history.id)} style={{ border: "none", borderRadius: "50%" }}><img src={remove} style={{ height: "4vh" }} /></button>

                                            </td>

                                        </tr>
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="card">
                        <div className="empty-state">
                            {errors ? (
                                <h4>{errors.message}</h4>
                            ) : (
                                <>
                                    <div className="empty-icon">📋</div>
                                    <h3>No analyses yet</h3>
                                    <p>Upload your first resume to get started with ATS scoring.</p>
                                    <Button url='/upload-resume' name="Start First Analysis" className="btn btn-primary" style={{ marginTop: "1.5rem" }} />
                                </>
                            )}
                        </div >
                    </div >
                )
                }
            </main >
        </>
    )
}

export default RecentHistory

