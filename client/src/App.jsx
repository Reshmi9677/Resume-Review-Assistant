import { useState } from "react";
import "./App.css";

function ResultPage({ analysis, fileName, onCheckAnother }) {
    const score = Number(analysis.atsScore) || 0;

    const scoreMessage =
        score >= 80
            ? "Excellent resume"
            : score >= 60
            ? "Good, but it can be improved"
            : "Your resume needs improvement";

    return (
        <div className="report-page">
            <header className="report-header">
                <div className="logo">
                    <span className="logo-icon">R</span>
                    Resume<span>Wise</span>
                </div>

                <button
                    className="check-another-button"
                    onClick={onCheckAnother}
                >
                    Check another resume
                </button>
            </header>

            <main className="report-layout">
                <aside className="report-sidebar">
                    <p className="sidebar-label">
                        RESUME REPORT
                    </p>

                    <div
                        className="report-score-ring"
                        style={{ "--score": `${score}%` }}
                    >
                        <div>
                            <strong>{score}</strong>
                            <span>/100</span>
                        </div>
                    </div>

                    <h2>{scoreMessage}</h2>

                    <p className="report-filename">
                        {fileName}
                    </p>

                    <div className="report-menu">
                        <a href="#overview">Overview</a>
                        <a href="#strengths">Strengths</a>
                        <a href="#improvements">Improvements</a>
                        <a href="#skills">Suggested skills</a>
                    </div>
                </aside>

                <section className="report-content">
                    <div className="report-title" id="overview">
                        <div>
                            <span className="report-badge">
                                AI ANALYSIS COMPLETE
                            </span>

                            <h1>Your resume report</h1>

                            <p>
                                Review the recommendations below to
                                improve your resume and make it more
                                effective for recruiters.
                            </p>
                        </div>

                        <div className="complete-badge">
                            ✓ Analysis complete
                        </div>
                    </div>

                    <article className="overview-card">
                        <div className="overview-icon">◎</div>

                        <div>
                            <span>OVERALL REVIEW</span>
                            <h2>{scoreMessage}</h2>
                            <p>{analysis.summary}</p>
                        </div>
                    </article>

                    <div className="quick-stats">
                        <div>
                            <strong>
                                {analysis.strengths?.length || 0}
                            </strong>
                            <span>Strong points</span>
                        </div>

                        <div>
                            <strong>
                                {analysis.improvements?.length || 0}
                            </strong>
                            <span>Improvements</span>
                        </div>

                        <div>
                            <strong>
                                {analysis.missingSkills?.length || 0}
                            </strong>
                            <span>Suggested skills</span>
                        </div>
                    </div>

                    <article
                        className="report-detail-card success-card"
                        id="strengths"
                    >
                        <div className="detail-heading">
                            <span className="detail-icon">✓</span>

                            <div>
                                <h2>What your resume does well</h2>
                                <p>
                                    These elements improve your resume’s
                                    quality and readability.
                                </p>
                            </div>
                        </div>

                        <ul>
                            {analysis.strengths?.map(
                                (item, index) => (
                                    <li key={index}>
                                        <span>✓</span>
                                        <p>{item}</p>
                                    </li>
                                )
                            )}
                        </ul>
                    </article>

                    <article
                        className="report-detail-card warning-card"
                        id="improvements"
                    >
                        <div className="detail-heading">
                            <span className="detail-icon">↑</span>

                            <div>
                                <h2>Recommended improvements</h2>
                                <p>
                                    Fix these points to create a stronger
                                    and more convincing resume.
                                </p>
                            </div>
                        </div>

                        <ul>
                            {analysis.improvements?.map(
                                (item, index) => (
                                    <li key={index}>
                                        <span>{index + 1}</span>
                                        <p>{item}</p>
                                    </li>
                                )
                            )}
                        </ul>
                    </article>

                    <article
                        className="report-detail-card skills-card"
                        id="skills"
                    >
                        <div className="detail-heading">
                            <span className="detail-icon">✦</span>

                            <div>
                                <h2>Skills to consider adding</h2>
                                <p>
                                    Add these only if they match your
                                    actual knowledge and experience.
                                </p>
                            </div>
                        </div>

                        <div className="report-skill-list">
                            {analysis.missingSkills?.map(
                                (skill, index) => (
                                    <span key={index}>
                                        {skill}
                                    </span>
                                )
                            )}
                        </div>
                    </article>

                    <div className="final-action">
                        <div>
                            <h2>Ready to improve another resume?</h2>
                            <p>
                                Upload a revised version to check your
                                progress.
                            </p>
                        </div>

                        <button onClick={onCheckAnother}>
                            Upload another resume
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
} 
function App() {
    const [resume, setResume] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [currentPage, setCurrentPage] = useState("upload");
    const [fileName, setFileName] = useState("");
    const [targetRole, setTargetRole] = useState("");
    const [jobDescription, setJobDescription] = useState("");

    const handleUpload = async (event) => {
        event.preventDefault();

        if (!resume) {
            setMessage("Please select a PDF resume");
            return;
        }

        const formData = new FormData();
        formData.append("resume", resume);
        formData.append("targetRole", targetRole);
        formData.append("jobDescription", jobDescription);

        try {
            setLoading(true);
            setMessage("");
            setAnalysis(null);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setMessage(`${data.message}: ${data.fileName}`);
            setAnalysis(data.analysis);
            setFileName(data.fileName);
            setCurrentPage("result");

window.scrollTo({
    top: 0,
    behavior: "smooth"
});
            
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (currentPage === "result" && analysis) {
    return (
        <ResultPage
            analysis={analysis}
            fileName={fileName}
            onCheckAnother={() => {
                setCurrentPage("upload");
                setAnalysis(null);
                setResume(null);
                setMessage("");
                setFileName("");
                setTargetRole("");
                setJobDescription("");

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }}
        />
    );
}

    return (
        <div className="website" id="home">
            <nav className="navbar">
                <div className="logo">
                    <span className="logo-icon">R</span>
                    Resume<span>Wise</span>
                </div>

                <div className="nav-links">
                    <a href="#home">Home</a>
                    <a href="#analyzer">Analyzer</a>
                    <a href="#features">Features</a>
                </div>

                <a href="#analyzer" className="nav-button">
                    Review Resume
                </a>
            </nav>

            <main className="hero">
                <section className="hero-content">
                    <div className="tag">AI-POWERED RESUME REVIEW</div>

                    <h1>
                        Build a resume that gets you
                        <span> noticed.</span>
                    </h1>

                    <p>
                        Upload your resume and receive clear suggestions,
                        ATS feedback and AI-powered improvements.
                    </p>

                    <div className="benefits">
                        <span>✓ ATS-friendly feedback</span>
                        <span>✓ Secure PDF upload</span>
                        <span>✓ Simple improvements</span>
                    </div>
                </section>

                <section id="analyzer" className="upload-card">
                    <div className="card-heading">
                        <span className="step">STEP 1</span>
                        <h2>Upload your resume</h2>
                        <p>PDF format only · Maximum size 5 MB</p>
                    </div>

                    <form onSubmit={handleUpload}>
                        <div className="job-fields">
                            <div className="input-group">
                                <label htmlFor="targetRole">
                                    Target job role
                                </label>

                                <input
                                    id="targetRole"
                                    type="text"
                                    placeholder="Example: Full Stack Developer"
                                    value={targetRole}
                                    onChange={(event) =>
                                        setTargetRole(event.target.value)
                                    }
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="jobDescription">
                                    Job description <span>(optional)</span>
                                </label>

                                <textarea
                                    id="jobDescription"
                                    placeholder="Paste the job requirements here for a more accurate analysis..."
                                    value={jobDescription}
                                    onChange={(event) =>
                                        setJobDescription(event.target.value)
                                    }
                                    rows="4"
                                />
                            </div>
                        </div>

                        <label className="upload-area" htmlFor="resume">
                            <div className="upload-icon">↑</div>

                            {resume ? (
                                <>
                                    <strong>{resume.name}</strong>
                                    <span>PDF selected successfully</span>
                                </>
                            ) : (
                                <>
                                    <strong>Drop your resume here</strong>
                                    <span>or click to browse your files</span>
                                </>
                            )}

                            <input
                                id="resume"
                                type="file"
                                accept="application/pdf"
                                onChange={(event) => {
                                    setResume(event.target.files[0]);
                                    setMessage("");
                                }}
                            />
                        </label>
            {loading && (
  <div className="analysis-loader">
    <div className="loader-spinner"></div>

    <div className="loader-information">
      <strong>Analyzing your resume...</strong>
      <span>Checking ATS score, skills and improvements</span>

      <div className="loader-progress">
        <div className="loader-progress-bar"></div>
      </div>
    </div>
  </div>
)}
                        <button type="submit" disabled={loading}>
                            {loading
                                ? "Uploading resume..."
                                : "Analyze My Resume →"}
                        </button>
                    </form>

                    {message && (
                        <p className="message">{message}</p>
                    )}

                    <p className="privacy">
                        🔒 Your resume is processed securely and is not shared.
                    </p>
                </section>
            </main>
           
            <section id="features" className="features">
                <article>
                    <div className="feature-icon">◎</div>
                    <h3>ATS Score</h3>
                    <p>
                        Check how well your resume can pass automated
                        screening systems.
                    </p>
                </article>

                <article>
                    <div className="feature-icon">✦</div>
                    <h3>AI Suggestions</h3>
                    <p>
                        Get practical recommendations for skills,
                        content and formatting.
                    </p>
                </article>

                <article>
                    <div className="feature-icon">✓</div>
                    <h3>Actionable Feedback</h3>
                    <p>
                        Understand your strengths and the areas that
                        need improvement.
                    </p>
                </article>
            </section>
            <section className="how-it-works" id="how-it-works">
  <div className="section-heading">
    <span>HOW IT WORKS</span>
    <h2>Get your resume reviewed in 3 simple steps</h2>
    <p>
      Upload your resume and receive clear, AI-powered feedback
      within seconds.
    </p>
  </div>

  <div className="steps-container">
    <article className="step-card">
      <div className="step-number">01</div>
      <div className="step-card-icon">↑</div>
      <h3>Upload your resume</h3>
      <p>Select a PDF resume of maximum 5 MB from your device.</p>
    </article>

    <article className="step-card">
      <div className="step-number">02</div>
      <div className="step-card-icon">✦</div>
      <h3>AI analyzes it</h3>
      <p>
        Gemini AI checks your content, skills and ATS compatibility.
      </p>
    </article>

    <article className="step-card">
      <div className="step-number">03</div>
      <div className="step-card-icon">✓</div>
      <h3>Receive your report</h3>
      <p>
        View your ATS score, strengths, missing skills and improvements.
      </p>
    </article>
  </div>
</section>
<section className="faq-section">
  <div className="section-heading">
    <span>FREQUENTLY ASKED QUESTIONS</span>
    <h2>Everything you need to know</h2>
    <p>Common questions about our AI resume analysis.</p>
  </div>

  <div className="faq-container">
    <details>
      <summary>Is my resume stored permanently?</summary>
      <p>
        Your PDF is processed securely. Only the analysis result and file
        name are stored for review history.
      </p>
    </details>

    <details>
      <summary>What type of resume can I upload?</summary>
      <p>
        You can upload a readable PDF resume with a maximum size of 5 MB.
      </p>
    </details>

    <details>
      <summary>How is the ATS score calculated?</summary>
      <p>
        AI reviews your resume structure, skills, content quality and
        compatibility with applicant tracking systems.
      </p>
    </details>

    <details>
      <summary>How long does the analysis take?</summary>
      <p>
        Analysis normally completes within a few seconds, depending on the
        PDF size and internet connection.
      </p>
    </details>
  </div>
</section>

<footer className="footer">
  <div className="footer-content">
    <div className="footer-brand">
      <div className="logo">
        <span className="logo-icon">R</span>
        <span>Resume <strong>Wise</strong></span>
      </div>

      <p>
        AI-powered resume feedback to help you build a stronger resume.
      </p>
    </div>

    <div className="footer-links">
      <a href="#home">Home</a>
      <a href="#analyzer">Analyzer</a>
      <a href="#features">Features</a>
      <a href="#how-it-works">How it works</a>
    </div>
  </div>

  <div className="footer-bottom">
    <p>© 2026 Resume Wise. Built by Reshmi Kumari.</p>
    <span>Powered by Gemini AI</span>
  </div>
</footer>
        </div>
    );
}

export default App;
