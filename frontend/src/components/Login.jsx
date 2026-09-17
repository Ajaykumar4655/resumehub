import { useContext, useState } from 'react'
import axios from 'axios'
import Button from "./Button"
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthProvider'

function Login() {

    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [errors, setErrors] = useState()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext)

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)

        const userData = {
            username, password
        }

        try {
            const response = await axios.post("http://localhost:8000/api/token/", userData, { withCredentials: true })
            setErrors()
            localStorage.setItem('access_token', response.data.access)
            navigate("/dashboard")
            setIsLoggedIn(true)
        } catch (error) {
            setErrors(error.response.data.detail)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <main>
                <div className="auth-wrap">
                {errors && (<div class="alert alert-warning alert-dismissible fade show" role="alert">
                    {errors}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>)}
                <h1>Welcome back</h1>
                <p className="sub">Log in to view your dashboard and analysis history.</p>

                <div className="card auth-card">
                    <form method="post" onSubmit={handleLogin}>
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <input className="form-input" type="text" value={username || ""} onChange={(e) => setUsername(e.target.value)} required autoFocus />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input className="form-input" type="password" value={password || ""} onChange={(e) => setPassword(e.target.value)} required autoComplete='current-password' />
                        </div>

                        {loading ? (<button className="btn btn-primary btn-lg btn-block" type='submit'>Login...</button>)
                            : (<button className="btn btn-primary btn-lg btn-block" type='submit'>Log In</button>)}
                    </form>
                </div>

                <div className="auth-footer">
                    Don't have an account? <Button url="/register" name="Register" />
                </div>
            </div>
            </main>
        </>
    )
}

export default Login