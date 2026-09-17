import "../assets/style/main1.css"
import home from "../assets/img/screen.png"
import Button from './Button.jsx'
import { AuthContext } from "../AuthProvider"
import { useContext, useEffect, useRef, useState } from "react"

function useInView(threshold = 0.2) {
    const ref = useRef(null)
    const [inView, setInView] = useState(false)

    useEffect(() => {
        const node = ref.current
        if (!node) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true)
                    observer.unobserve(node)
                }
            },
            { threshold }
        )
        observer.observe(node)
        return () => observer.disconnect()
    }, [threshold])

    return [ref, inView]
}

function useCountUp(target, inView, duration = 1400) {
    const [value, setValue] = useState(0)

    useEffect(() => {
        if (!inView) return
        let start = null
        let frame

        const step = (timestamp) => {
            if (!start) start = timestamp
            const progress = Math.min((timestamp - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.floor(eased * target))
            if (progress < 1) frame = requestAnimationFrame(step)
        }
        frame = requestAnimationFrame(step)
        return () => cancelAnimationFrame(frame)
    }, [inView, target, duration])

    return value
}

function useTilt(strength = 10) {
    const ref = useRef(null)

    const onMouseMove = (e) => {
        const node = ref.current
        if (!node) return
        const rect = node.getBoundingClientRect()
        const px = (e.clientX - rect.left) / rect.width - 0.5
        const py = (e.clientY - rect.top) / rect.height - 0.5
        node.style.transform = `perspective(900px) rotateX(${-py * strength}deg) rotateY(${px * strength}deg) translateY(-4px)`
    }

    const onMouseLeave = () => {
        const node = ref.current
        if (!node) return
        node.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)"
    }

    return { ref, onMouseMove, onMouseLeave }
}

const TargetIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></svg>
)
const DocIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h6" /></svg>
)
const PdfIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" /><path d="M14 3v5h5" /><path d="M9 15.5v-3h1.3c.7 0 1.2.5 1.2 1s-.5 1-1.2 1H9" /><path d="M13 15.5v-3h1.4" /><path d="M13 14h1" /></svg>
)
const ShieldIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 5 6v6c0 4.2 3 7.8 7 9 4-1.2 7-4.8 7-9V6l-7-3Z" /><path d="m9.5 12 1.8 1.8L14.5 10" /></svg>
)
const BrainIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4a2.5 2.5 0 0 1 2.5 2.5v11A2.5 2.5 0 0 1 7 19c-1 0-1.6-.4-2-1" /><path d="M9 8H6.5A1.5 1.5 0 0 0 5 9.5v0A1.5 1.5 0 0 0 6.5 11" /><path d="M9 14H6a1.5 1.5 0 0 0 0 3" /><path d="M15 4a2.5 2.5 0 0 0-2.5 2.5v11A2.5 2.5 0 0 0 17 19c1 0 1.6-.4 2-1" /><path d="M15 8h2.5A1.5 1.5 0 0 1 19 9.5v0A1.5 1.5 0 0 1 17.5 11" /><path d="M15 14h3a1.5 1.5 0 0 1 0 3" /></svg>
)
const GraphIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19h16" /><path d="M7 19v-6M12 19V7M17 19v-10" /></svg>
)
const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L19 7" /></svg>
)

const FEATURES = [
    { icon: <TargetIcon />, iconClass: "icon-indigo", title: "Resume Matcher", text: "Upload your resume and compare it with any job description using AI-powered matching." },
    { icon: <DocIcon />, iconClass: "icon-blue", title: "Resume Builder", text: "Create professional ATS-friendly resumes using customizable templates and export them as PDF." },
    { icon: <PdfIcon />, iconClass: "icon-amber", title: "PDF Resume Extraction", text: "Automatically extract resume information from PDF files using Python PDF extraction libraries." },
    { icon: <ShieldIcon />, iconClass: "icon-rose", title: "Personal Information Removal", text: "Protect your privacy by automatically removing personal information before AI analysis." },
    { icon: <BrainIcon />, iconClass: "icon-teal", title: "Gemini AI Analysis", text: "Gemini AI analyzes your resume, identifies strengths and weaknesses, and provides detailed improvement suggestions." },
    { icon: <GraphIcon />, iconClass: "icon-cyan", title: "Skill Matching", text: "Compare your resume with job descriptions and receive an accurate match percentage with missing skills." },
]

const STATS = [
    { value: 95, suffix: "%", label: "Matching Accuracy" },
    { value: 10, suffix: "K+", label: "Resumes Processed" },
    { value: 5000, suffix: "+", label: "Users" },
    { value: 99, suffix: "%", label: "ATS Friendly" },
]

function FeatureCard({ icon, iconClass, title, text, delay }) {
    const [revealRef, inView] = useInView(0.15)
    const { ref: tiltRef, onMouseMove, onMouseLeave } = useTilt(8)

    const setRefs = (node) => {
        revealRef.current = node
        tiltRef.current = node
    }

    return (
        <div
            ref={setRefs}
            className={`feature-card reveal ${inView ? "in-view" : ""}`}
            style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
        >
            <div className={`feature-icon ${iconClass}`}>{icon}</div>
            <h3>{title}</h3>
            <p>{text}</p>
        </div>
    )
}

function StatItem({ value, suffix, label }) {
    const [ref, inView] = useInView(0.4)
    const count = useCountUp(value, inView)

    return (
        <div ref={ref} className="stat-item">
            <div className="stat-num">{count}{suffix}</div>
            <div className="stat-label">{label}</div>
        </div>
    )
}

function Main() {
    const { isLoggedIn } = useContext(AuthContext)

    const [heroHeadRef, heroHeadIn] = useInView(0.1)
    const [featHeadRef, featHeadIn] = useInView(0.2)
    const [builderRef, builderIn] = useInView(0.15)
    const [matchingRef, matchingIn] = useInView(0.15)
    const [ctaRef, ctaIn] = useInView(0.2)

    const [parallax, setParallax] = useState({ x: 0, y: 0 })

    const handleParallax = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        setParallax({ x, y })
    }

    const resetParallax = () => setParallax({ x: 0, y: 0 })

    const layer = (mult) => ({
        transform: `translate(${parallax.x * mult}px, ${parallax.y * mult}px)`
    })

    return (
        <>
            <main className="home-page">
                
                <div className="hero">
                    <div ref={heroHeadRef} className={`reveal ${heroHeadIn ? "in-view" : ""}`}>
                        <div className="section-eyebrow">✨ AI Career Intelligence</div>
                        <h1 className="hero-title">
                            AI-Powered <span className="gradient-text">Resume Matcher</span> &amp; Resume Builder
                        </h1>
                        <p className="hero-sub">
                            Build professional ATS-friendly resumes and instantly compare them with job
                            descriptions using advanced AI.
                        </p>
                        <p className="hero-desc">
                            Our platform helps job seekers create professional resumes, extract resume content
                            from PDF files, remove personal information, analyze skills, and compare resumes
                            against job descriptions using Gemini AI.
                        </p>

                        <div className="hero-actions">
                            {isLoggedIn ? (
                                <>
                                    <Button className="btn btn-primary btn-lg" url="/upload-resume" name="📄 Upload Resume" />
                                    <Button className="btn btn-outline btn-lg" url="/dashboard" name="View Dashboard" />
                                </>
                            ) : (
                                <>
                                    <Button className="btn btn-primary btn-lg" url="/register" name="Get Started" />
                                    <a className="btn btn-outline btn-lg" href="#features">Learn More</a>
                                </>
                            )}
                        </div>

                        <div className="hero-stats">
                            <div>
                                <div className="hero-stat-val">200+</div>
                                <div className="hero-stat-label">Skills Tracked</div>
                            </div>
                            <div>
                                <div className="hero-stat-val">&lt;2s</div>
                                <div className="hero-stat-label">Analysis Time</div>
                            </div>
                            <div>
                                <div className="hero-stat-val">100%</div>
                                <div className="hero-stat-label">Private by Design</div>
                            </div>
                        </div>

                    </div>

                    <div className="hero-visual">
                        <div className="hero-3d" onMouseMove={handleParallax} onMouseLeave={resetParallax}>
                            <div className="blob-glow" />
                            <div className="orbit-ring" style={layer(6)} />

                            <div className="floating-card card-resume" style={layer(14)}>
                                <div className="card-resume-dots">
                                    <span className="dot-red" /><span className="dot-amber" /><span className="dot-green" />
                                </div>
                                <div className="card-resume-line w-70" />
                                <div className="card-resume-line w-90" />
                                <div className="card-resume-line w-50" />
                                <div className="card-resume-line accent w-70" />
                            </div>

                            <div className="floating-card badge-score" style={layer(-16)}>
                                <div className="score-ring"><span>92%</span></div>
                                <p>Match Score</p>
                            </div>

                            <div className="floating-card badge-ai" style={layer(10)}>
                                ✨ Gemini AI
                            </div>

                            <div className="floating-card chip-skill chip-1" style={layer(-10)}>
                                <CheckIcon /> React
                            </div>
                            <div className="floating-card chip-skill chip-2" style={layer(12)}>
                                <CheckIcon /> Django
                            </div>
                        </div>
                    </div>
                </div>

                <div id="features" ref={featHeadRef} className={`section-head reveal ${featHeadIn ? "in-view" : ""}`}>
                    <span className="section-eyebrow">What You Get</span>
                    <h2>Everything you need to land the interview</h2>
                    <p>From AI matching to a full resume builder — one platform for the entire job-application workflow.</p>
                </div>

                <div className="features">
                    {FEATURES.map((f, i) => (
                        <FeatureCard key={f.title} {...f} delay={i * 90} />
                    ))}
                </div>

                <div className="builder-section">
                    <div ref={builderRef} className={`reveal ${builderIn ? "in-view" : ""}`}>
                        <span className="section-eyebrow">Resume Builder</span>
                        <div className="split-eyebrow-row">
                            <h2>Professional Resume Builder</h2>
                            <p className="lead">
                                Design ATS-friendly resumes with customizable templates — no design experience
                                required.
                            </p>
                        </div>
                        <ul className="check-list">
                            <li><CheckIcon /> Multiple resume templates</li>
                            <li><CheckIcon /> Live preview while you edit</li>
                            <li><CheckIcon /> One-click PDF export</li>
                            <li><CheckIcon /> Professional, ATS-optimized layouts</li>
                            <li><CheckIcon /> Modern typography, easy editing</li>
                            <li><CheckIcon /> Fully responsive editor</li>
                        </ul>
                    </div>

                    <div className="builder-mock">
                        <div className="floating-card template-stack" style={{ animationDelay: "0.2s" }}>
                            <div className="tpl-header" />
                            <div className="card-resume-line w-90" />
                            <div className="card-resume-line w-70" />
                            <div className="card-resume-line w-50" />
                        </div>
                        <div className="floating-card export-chip">
                            <div className="label">Export</div>
                            <div className="value">resume.pdf</div>
                        </div>
                        <div className="floating-card ats-pill">ATS Optimized</div>
                    </div>
                </div>

                <div className="matching-section">
                    <div ref={matchingRef} className={`reveal ${matchingIn ? "in-view" : ""}`}>
                        <span className="section-eyebrow">Resume Matching</span>
                        <div className="split-eyebrow-row">
                            <h2>AI Resume Matching</h2>
                            <p className="lead">
                                Upload your resume and a job description to instantly receive a full breakdown
                                of how well you match.
                            </p>
                        </div>
                        <ul className="check-list">
                            <li><CheckIcon /> Match percentage</li>
                            <li><CheckIcon /> Missing skills</li>
                            <li><CheckIcon /> Strengths &amp; weaknesses</li>
                            <li><CheckIcon /> Improvement suggestions</li>
                            <li><CheckIcon /> Keyword optimization</li>
                            <li><CheckIcon /> ATS compatibility score</li>
                        </ul>
                    </div>

                    <div className="screenshot-frame">
                        <img src={home} alt="Resume analyzer dashboard preview" />
                        <div className="floating-card match-badge">
                            <div className="pct">92%</div>
                            <div className="pct-label">MATCH</div>
                        </div>
                    </div>
                </div>

                <div className="stats-section">
                    {STATS.map((s) => (
                        <StatItem key={s.label} {...s} />
                    ))}
                </div>

                <div ref={ctaRef} className={`cta-banner reveal ${ctaIn ? "in-view" : ""}`}>
                    <h2>Ready to land your next interview?</h2>
                    <p>Build a standout resume and match it to any job in seconds.</p>
                    {isLoggedIn ? (
                        <Button className="btn btn-primary btn-lg" url="/upload-resume" name="📄 Upload Resume" />
                    ) : (
                        <Button className="btn btn-primary btn-lg" url="/register" name="Get Started" />
                    )}
                </div>
            </main>
        </>
    )
}

export default Main