import { useEffect, useState } from "react";
import "../assets/style/result.css";
import axios from "axios";
import Button from "./Button";
import { useLocation } from "react-router-dom";

function Result() {
    const [responseResult, setResponseResult] = useState(null);
    const location = useLocation()
    const [storeId, setStoreId] = useState(location.state?.id || 0)
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        const url = import.meta.env.VITE_BACKEND_ROOT;
        const fetchResult = async () => {
            setLoading(true)
            try {
                if (storeId === 0) {
                    const response = await axios.get(`${url}/result/`);
                    setResponseResult(response.data);
                } else {
                    const response = await axios.get(`${url}/result/${storeId}/`, { withCredentials: true })
                    setResponseResult(response.data)
                }
            } catch (error) {
                setErrors(error.response.data)
            }finally{
                setLoading(false)
            }
        };

        fetchResult();
    }, []);


    const [resumeName, setResumeName] = useState("");
    const [jdName, setJdName] = useState("");
    const [overallMatchScore, setOverallMatchScore] = useState(0);
    const [sectionsFound, setSectionsFound] = useState([]);
    const [sectionsMissing, setSectionsMissing] = useState([]);
    const [sectionCompletenessScore, setSectionCompletenessScore] = useState(0);
    const [matchedSkills, setMatchedSkills] = useState([]);
    const [missingSkills, setMissingSkills] = useState([]);
    const [extraSkills, setExtraSkills] = useState([]);
    const [matchedKeywords, setMatchedKeywords] = useState([]);
    const [missingKeywords, setMissingKeywords] = useState([]);
    const [recommendedKeywords, setRecommendedKeywords] = useState([]);
    const [improvementSuggestions, setImprovementSuggestions] = useState([]);
    const [mustHave, setMustHave] = useState([]);
    const [goodToHave, setGoodToHave] = useState([]);
    const [companyPreferences, setCompanyPreferences] = useState([]);
    const [finalRecommendation, setFinalRecommendation] = useState("");
    const [createdAt, setCreatedAt] = useState("");

    const [errors, setErrors] = useState()
    const [errorDismissed, setErrorDismissed] = useState(false)

    useEffect(() => {
        if (!responseResult || responseResult.length === 0) return;

        const result = responseResult[0];
        setResumeName(result.resume_file_name);
        setJdName(result.job_info.job_title);
        setOverallMatchScore(result.result_json.overall_match_score);

        const foundSections = Object.entries(
            result.result_json.section_analysis.sections_found
        ).map(([name, found]) => ({ name, found }));

        const missingSections = Object.entries(
            result.result_json.section_analysis.sections_missing
        ).map(([name, missing]) => ({ name, missing }));

        setSectionsFound(foundSections);
        setSectionsMissing(missingSections);

        setSectionCompletenessScore(
            result.result_json.section_analysis.section_completeness_score
        );

        setMatchedSkills(result.result_json.skills_match.matched_skills || []);
        setMissingSkills(result.result_json.skills_match.missing_skills || []);
        setExtraSkills(result.result_json.skills_match.extra_skills || []);
        setMatchedKeywords(result.result_json.keyword_match.matched_keywords || []);
        setMissingKeywords(result.result_json.keyword_match.missing_keywords || []);
        setRecommendedKeywords(result.result_json.keyword_match.recommended_keywords || []);
        setImprovementSuggestions(result.result_json.improvement_suggestions || []);
        setMustHave(result.result_json.jd_breakdown.must_have || []);
        setGoodToHave(result.result_json.jd_breakdown.good_to_have || []);
        setCompanyPreferences(result.result_json.jd_breakdown.company_preferences || []);
        setFinalRecommendation(result.result_json.final_recommendation);
        setCreatedAt(result.created_at);
    }, [responseResult]);

    const jdSkillsTotal =
        (matchedSkills?.length || 0) + (missingSkills?.length || 0);

    const keywordTotal =
        (matchedKeywords?.length || 0) + (missingKeywords?.length || 0);

    const skillMatchRate =
        jdSkillsTotal > 0 ? Math.round((matchedSkills.length / jdSkillsTotal) * 100) : 0;

    const keywordCoverageRate =
        keywordTotal > 0 ? Math.round((matchedKeywords.length / keywordTotal) * 100) : 0;

    const tier =
        overallMatchScore >= 75 ? "excellent" : overallMatchScore >= 50 ? "good" : "weak";

    const scoreColor =
        tier === "excellent" ? "var(--success)" : tier === "good" ? "var(--warning)" : "var(--danger)";

    const scoreTierLabel =
        tier === "excellent" ? "Excellent Match" : tier === "good" ? "Good Match" : "Weak Match";

    const scoreMessage =
        tier === "excellent"
            ? "Your resume successfully clears automated ATS filters for this role."
            : tier === "good"
                ? "Decent match — a few gaps to close before applying."
                : "Weak match — significant rework needed before applying.";


    const gaugeCircumference = 2 * Math.PI * 83; // matches the r=83 ring below
    const gaugeDash = ((overallMatchScore / 100) * gaugeCircumference).toFixed(1);

    const topStrengths = matchedSkills.slice(0, 3);
    const minorGaps = missingSkills.slice(0, 3);
    const actuallyMissingSections = sectionsMissing.filter((s) => s.missing);

    const createdAtReadable = createdAt ? new Date(createdAt).toLocaleDateString() : "";

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <main className="result-page">
            {errors ? (
                <>
                    {!errorDismissed && (
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
                    <div className="error-empty-state">
                        <p style={{ color: "var(--ink-soft)" }}>
                            We couldn't load this result. Head back to your dashboard and try again.
                        </p>
                        <Button name="Go to Dashboard" url="/dashboard" className="btn btn-outline btn-lg" />
                    </div>
                </>
            ) : (
                <>
                    <Button name="← Dashboard" url="/dashboard" className="btn btn-outline" />

                    <div className="result-top">
                        <div className="result-header-block">
                            <h2 className="file-pill">{jdName} VS {resumeName}</h2>
                            <div className="result-meta-row">
                                📅 {createdAtReadable}
                            </div>
                        </div>

                        <div className="card score-hero">
                            <div className="score-ring-wrap">
                                <svg viewBox="0 0 190 190">
                                    <circle cx="95" cy="95" r="83" className="ring-bg" />
                                    <circle
                                        cx="95" cy="95" r="83"
                                        className="ring-fill"
                                        style={{ stroke: scoreColor }}
                                        strokeDasharray={`${gaugeDash} ${gaugeCircumference.toFixed(1)}`}
                                    />
                                </svg>
                                <div className="ring-center">
                                    <div className="ring-score">{overallMatchScore}%</div>
                                    <div className="ring-caption">ATS SCORE</div>
                                </div>
                            </div>
                            <div className="score-tier" style={{ color: scoreColor }}>{scoreTierLabel}</div>
                            <div className="score-msg">{scoreMessage}</div>
                        </div>
                    </div>

                    <div className="skills-section">
                        <div className="card">
                            <div className="skill-panel-header">
                                <div className="skill-panel-title"><span className="title-icon ok">✓</span>Matched Skills</div>
                                <span className="skill-count badge-green">{matchedSkills.length}</span>
                            </div>
                            <input className="search-filter" type="text" placeholder="Search skills..." />
                            <div className="skill-pills-wrap">
                                {matchedSkills?.length ? (
                                    matchedSkills.map((skill, i) => (
                                        <span key={i} className="skill-pill pill-green">{skill}</span>
                                    ))
                                ) : (
                                    <div className="empty-skills">No common skills detected. Try improving keyword alignment.</div>
                                )}
                            </div>
                        </div>

                        <div className="card">
                            <div className="skill-panel-header">
                                <div className="skill-panel-title"><span className="title-icon miss">✕</span>Missing Skills</div>
                                <span className="skill-count badge-red">{missingSkills.length}</span>
                            </div>
                            <input className="search-filter" type="text" placeholder="Search missing..." />
                            <div className="skill-pills-wrap">
                                {missingSkills?.length ? (
                                    missingSkills.map((skill, i) => (
                                        <span key={i} className="skill-pill pill-red">{skill}</span>
                                    ))
                                ) : (
                                    <div className="empty-skills">Perfect match! No missing skills.</div>
                                )}
                            </div>
                        </div>

                        <div className="card">
                            <div className="skill-panel-header">
                                <div className="skill-panel-title"><span className="title-icon extra">+</span>Extra Skills</div>
                                <span className="skill-count badge-blue">{extraSkills.length}</span>
                            </div>
                            <input className="search-filter" type="text" placeholder="Search extra..." />
                            <div className="skill-pills-wrap">
                                {extraSkills?.length ? (
                                    extraSkills.map((skill, i) => (
                                        <span key={i} className="skill-pill pill-blue">{skill}</span>
                                    ))
                                ) : (
                                    <div className="empty-skills">No additional skills detected beyond JD requirements.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="req-columns">
                        <div className="card">
                            <div className="req-eyebrow">Core Requirements</div>
                            <ul className="req-list">
                                {mustHave?.length ? (
                                    mustHave.map((item, i) => (
                                        <li key={i} className="req-item">
                                            <span className="req-icon tone-core">✓</span>{item}
                                        </li>
                                    ))
                                ) : (
                                    <li className="req-empty">No core requirements detected.</li>
                                )}
                            </ul>
                        </div>

                        <div className="card">
                            <div className="req-eyebrow">Company Expectations</div>
                            <ul className="req-list">
                                {companyPreferences?.length ? (
                                    companyPreferences.map((item, i) => (
                                        <li key={i} className="req-item">
                                            <span className="req-icon tone-company">•</span>{item}
                                        </li>
                                    ))
                                ) : (
                                    <li className="req-empty">No company preferences detected.</li>
                                )}
                            </ul>
                        </div>

                        <div className="card">
                            <div className="req-eyebrow">Additional Value</div>
                            <ul className="req-list">
                                {goodToHave?.length ? (
                                    goodToHave.map((item, i) => (
                                        <li key={i} className="req-item">
                                            <span className="req-icon tone-value">★</span>{item}
                                        </li>
                                    ))
                                ) : (
                                    <li className="req-empty">No additional value skills detected.</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="audit-analytics-grid">
                        <div className="card">
                            <div className="card-title-row">
                                <h3>Resume Sections Audit</h3>
                                {actuallyMissingSections.length > 0 && (
                                    <span className="missing-badge">
                                        ⚠ {actuallyMissingSections.map((s) => s.name).join(", ").toUpperCase()} MISSING
                                    </span>
                                )}
                            </div>
                            <div className="audit-list">
                                {sectionsFound.map((section, i) => (
                                    <div key={i} className="audit-row">
                                        <span className={`audit-dot ${section.found ? "ok" : "warn"}`} />
                                        <div>
                                            <div className="audit-name-row">
                                                {section.name}
                                                <span className={`audit-tag ${section.found ? "" : "needs"}`}>
                                                    {section.found ? "DETECTED" : "NEEDS ATTENTION"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-title-row">
                                <h3>Resume Analytics</h3>
                            </div>

                            <div className="analytics-row">
                                <div className="analytics-label-row">
                                    <span>Completeness</span>
                                    <span className="val">{sectionCompletenessScore}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${sectionCompletenessScore}%` }} />
                                </div>
                            </div>

                            <div className="analytics-row">
                                <div className="analytics-label-row">
                                    <span>Skills Coverage</span>
                                    <span className="val">{skillMatchRate}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${skillMatchRate}%` }} />
                                </div>
                            </div>

                            <div className="analytics-row">
                                <div className="analytics-label-row">
                                    <span>Keyword Coverage</span>
                                    <span className="val">{keywordCoverageRate}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${keywordCoverageRate}%` }} />
                                </div>
                            </div>

                            <div className="analytics-footer">
                                <span className="icon-chip">🔑</span>
                                <span>{jdSkillsTotal} skills and {keywordTotal} keywords evaluated from the job description.</span>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ marginBottom: "1.5rem" }}>
                        <div className="ai-coach-head">✨ AI Resume Coach</div>
                        {improvementSuggestions?.length ? (
                            improvementSuggestions.map((s, i) => (
                                <div key={i} className="suggestion-item">
                                    <div className="sug-num">{i + 1}</div>
                                    <div className="sug-text">{s}</div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-skills">No improvement suggestions available for this analysis.</div>
                        )}
                    </div>

                    <div className="verdict-banner">
                        <svg className="verdict-seal" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10" />
                            <path d="m8 12 3 3 5-6" />
                        </svg>
                        <div className="verdict-content">
                            <div className="verdict-eyebrow">AI Insights</div>
                            <h2 className="verdict-heading">
                                Overall Verdict:
                            </h2>
                            <p className="verdict-desc">{finalRecommendation}</p>

                            <div className="verdict-lists">
                                <div>
                                    <div className="verdict-list-title strengths">Top Strengths</div>
                                    <ul className="verdict-list">
                                        {topStrengths.length ? (
                                            topStrengths.map((skill, i) => <li key={i}>✓ {skill}</li>)
                                        ) : (
                                            <li>No standout skills detected.</li>
                                        )}
                                    </ul>
                                </div>
                                <div>
                                    <div className="verdict-list-title gaps">Minor Gaps</div>
                                    <ul className="verdict-list">
                                        {minorGaps.length ? (
                                            minorGaps.map((skill, i) => <li key={i}>◇ {skill}</li>)
                                        ) : (
                                            <li>No significant gaps found.</li>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            <div className="verdict-metrics">
                                <div>
                                    <div className="verdict-metric-label">ATS Score</div>
                                    <div className="verdict-metric-bar-row">
                                        <div className="verdict-metric-bar">
                                            <span style={{ width: `${overallMatchScore}%`, background: "#34D399" }} />
                                        </div>
                                        <span className="verdict-metric-val">{overallMatchScore}%</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="verdict-metric-label">Section Completeness</div>
                                    <div className="verdict-metric-bar-row">
                                        <div className="verdict-metric-bar">
                                            <span style={{ width: `${sectionCompletenessScore}%`, background: "#60A5FA" }} />
                                        </div>
                                        <span className="verdict-metric-val">{sectionCompletenessScore}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </main>
    );
}

export default Result;