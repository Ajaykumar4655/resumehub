import "../assets/style/footer.css"
import Button from './Button'

function Footer() {
    return (
        <>
            <footer>
                <div className="footer-inner">
                    <div className="footer-logo">ResumeIQ</div>
                    <ul className="footer-links">
                        <li><a href="/">Product</a></li>
                        <li><Button name="About" url="/about" /></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                    </ul>
                    <div className="footer-copy">&copy; 2026 ResumeIQ &middot; Built by Parthiv Patel</div>
                </div>
            </footer>
        </>
    )
}

export default Footer