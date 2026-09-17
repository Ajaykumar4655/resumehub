import { React, useContext, useState } from 'react'
import '../assets/style/header.css'
import Button from './Button'
import { AuthContext } from '../AuthProvider'
import { useNavigate } from 'react-router-dom'
import logo from '/screen.png'

const MenuIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
)
const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
)

const Header = () => {

    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext)
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const closeMenu = () => setMenuOpen(false)

    const handleLogout = () => {
        localStorage.removeItem("access_token")
        setIsLoggedIn(false)
        closeMenu()
        navigate("/login")
    }

    return (
        <>
            <nav className={menuOpen ? "nav-menu-open" : ""}>
                <div className="nav-inner">
                    <a className="nav-logo" href="/">
                        <img src={logo} className='logo-icon' />
                        ResumeIQ
                    </a>

                    <button
                        type="button"
                        className="nav-toggle"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        {menuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>

                    <div className="nav-collapse">
                        <ul className="nav-links" onClick={closeMenu}>
                            <li><Button className="" url="/" name="Home" /></li>
                            <li><Button className="" url="/dashboard" name="Dashboard" /></li>
                            <li><Button className="" url="/about" name="About" /></li>
                        </ul>
                        <div className="nav-right">
                            {isLoggedIn
                                ? (<>
                                    <Button className='btn btn-outline' url="/upload-resume" name="+ New Analysis" />
                                    <Button className='btn btn-outline' url="/resume-builder" name="📄 Resume Builder" />
                                    <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
                                </>)
                                : (
                                    <>
                                        <Button className="btn btn-outline" url="/login" name="Login" />
                                        <Button className="btn btn-primary" url="/register" name="Register" />
                                    </>

                                )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header