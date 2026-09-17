import Button from "./Button.jsx"
import axios from 'axios'
import { useState } from "react"
import { useNavigate } from "react-router-dom"


function Register() {

    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [password1, setPassword1] = useState()
    const [password2, setPassword2] = useState()
    const navigate = useNavigate()
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const handleRegistration = async (e) => {
        e.preventDefault()
        setLoading(true)

        const userData = {
            username, email, password1, password2
        }

        try {
            const response = await axios.post("http://localhost:8000/api/register/", userData)
            setErrors({})
            navigate("/login")
        } catch (error) {
            setErrors(error.response.data)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="auth-wrap">
                <h1>Create your account</h1>
                <p className="sub">Start tracking your resume's ATS match score for free.</p>

                <div className="card auth-card">
                    <form method="post" onSubmit={handleRegistration}>
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <input className="form-input" type="text" value={username || ""}
                                required autoFocus onChange={(e) => setUsername(e.target.value)} />
                            <div className="form-errors">{errors.username}</div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input className="form-input" type="email" value={email || ""}
                                required onChange={(e) => setEmail(e.target.value)} />
                            <div className="form-errors">{errors.email}</div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input className="form-input" type="password" value={password1 || ""} required onChange={(e) => setPassword1(e.target.value)} autoComplete='new-password'/>
                            <div className="form-errors">{errors.password1}</div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input className="form-input" type="password" value={password2 || ""} onChange={(e) => setPassword2(e.target.value)} required autoComplete='current-password'/>
                            <div className="form-errors">{errors.password2}</div>
                        </div>
                        
                        {loading ? (<button type="submit" className="btn btn-primary btn-lg btn-block">Creating Account...</button>)
                            : (<button type="submit" className="btn btn-primary btn-lg btn-block">Create Account</button>)}

                    </form>
                </div>

                <div className="auth-footer">
                    Already have an account? <Button url="/login" name="Log In" className="" />
                </div>
            </div>

        </>
    )
}

export default Register