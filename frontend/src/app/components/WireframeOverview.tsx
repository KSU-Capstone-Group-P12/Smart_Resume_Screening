import { useNavigate } from "react-router";
import {
  FileText,
  BarChart3,
  User,
  MessageSquare,
  UploadCloud,
  Brain,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export function WireframeOverview() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Create New Screening",
      path: "/job-upload",
      icon: FileText,
      description: "Upload a job description and candidate resumes.",
    },
    {
      title: "Candidate Ranking Dashboard",
      path: "/ranking",
      icon: BarChart3,
      description: "Review ranked candidates with explainable AI insights.",
    },
    {
      title: "Candidate Detail",
      path: "/candidate/1",
      icon: User,
      description: "View strengths, gaps, scores, and recruiter notes.",
    },
    {
      title: "Interview Questions",
      path: "/interview/1",
      icon: MessageSquare,
      description: "Generate interview questions based on resume gaps.",
    },
  ];

  const workflow = [
    {
      icon: UploadCloud,
      title: "Upload",
      text: "Recruiters upload the job description and resumes.",
    },
    {
      icon: Brain,
      title: "Analyze",
      text: "The system compares resumes against the role requirements.",
    },
    {
      icon: BarChart3,
      title: "Rank",
      text: "Candidates are ranked with section-level match scores.",
    },
    {
      icon: ShieldCheck,
      title: "Review",
      text: "Recruiters make the final decision with AI support.",
    },
  ];

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <section style={heroStyle}>
          <div style={pill}>Humane Decision Support AI</div>

          <h1 style={mainTitle}>Smart Resume Screening</h1>

          <p style={heroText}>
            AI-powered candidate ranking and interview support for recruiters,
            designed for transparency, explainability, and human review.
          </p>

          <div style={heroButtons}>
            <button style={primaryButton} onClick={() => navigate("/job-upload")}>
              Start New Screening <ArrowRight size={16} />
            </button>

            <button style={secondaryButton} onClick={() => navigate("/ranking")}>
              View Rankings
            </button>
          </div>
        </section>

        <section style={actionGrid}>
          {actions.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                style={actionCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.border = "1px solid rgba(96,165,250,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)";
                }}
              >
                <div style={iconBox}>
                  <Icon size={26} color="#60a5fa" />
                </div>

                <h3 style={cardTitle}>{item.title}</h3>
                <p style={cardText}>{item.description}</p>
              </div>
            );
          })}
        </section>

        <section style={workflowPanel}>
          <div style={sectionHeader}>
            <div>
              <p style={sectionLabel}>System Workflow</p>
              <h2 style={sectionTitle}>From resume upload to recruiter review</h2>
            </div>
            <p style={sectionDesc}>
              The system supports recruiters without automatically rejecting candidates.
            </p>
          </div>

          <div style={workflowGrid}>
            {workflow.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={step.title} style={workflowCard}>
                  <div style={workflowIcon}>
                    <Icon size={22} color="#34d399" />
                  </div>
                  <div style={stepNumber}>0{index + 1}</div>
                  <h3 style={workflowTitle}>{step.title}</h3>
                  <p style={workflowText}>{step.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section style={bottomGrid}>
          <div style={infoCard}>
            <p style={sectionLabel}>Why it matters</p>
            <h2 style={sectionTitle}>Explainable hiring support</h2>

            <div style={checkList}>
              {[
                "Section-level scoring for skills, experience, education, projects, and certifications.",
                "Strengths and gaps are shown in recruiter-friendly language.",
                "Interview questions help verify candidate fit during human review.",
              ].map((text) => (
                <div key={text} style={checkItem}>
                  <CheckCircle2 size={18} color="#34d399" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={noticeCard}>
            <p style={sectionLabel}>Ethical Design</p>
            <h2 style={sectionTitle}>Human remains in control</h2>
            <p style={cardText}>
              This system is designed as decision support only. It does not
              automatically reject candidates, and recruiters remain responsible
              for final hiring decisions.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------- styles ---------- */

const pageStyle = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top, #10203a 0%, #071426 38%, #020617 100%)",
  padding: "42px",
  color: "#fff",
};

const heroStyle = {
  textAlign: "center" as const,
  padding: "34px 0 44px",
};

const pill = {
  display: "inline-block",
  padding: "8px 14px",
  borderRadius: "999px",
  background: "rgba(96,165,250,0.12)",
  border: "1px solid rgba(96,165,250,0.25)",
  color: "#bfdbfe",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.7px",
  marginBottom: "18px",
};

const mainTitle = {
  margin: 0,
  fontSize: "46px",
  fontWeight: 900,
  letterSpacing: "-0.8px",
};

const heroText = {
  maxWidth: "720px",
  margin: "16px auto 0",
  color: "#94a3b8",
  fontSize: "16px",
  lineHeight: 1.6,
};

const heroButtons = {
  marginTop: "26px",
  display: "flex",
  justifyContent: "center",
  gap: "14px",
};

const primaryButton = {
  padding: "13px 18px",
  borderRadius: "12px",
  background: "rgba(16,185,129,0.18)",
  border: "1px solid rgba(16,185,129,0.32)",
  color: "#a7f3d0",
  fontWeight: 800,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const secondaryButton = {
  padding: "13px 18px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#e5e7eb",
  fontWeight: 700,
  cursor: "pointer",
};

const actionGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "18px",
  marginBottom: "24px",
};

const actionCard = {
  cursor: "pointer",
  padding: "24px",
  borderRadius: "18px",
  background: "linear-gradient(145deg, #0b1220, #0f1e3a)",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "0 18px 36px rgba(0,0,0,0.38)",
  transition: "all 0.25s ease",
  minHeight: "160px",
};

const iconBox = {
  width: "48px",
  height: "48px",
  borderRadius: "14px",
  background: "rgba(96,165,250,0.12)",
  border: "1px solid rgba(96,165,250,0.22)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "16px",
};

const cardTitle = {
  margin: 0,
  fontSize: "16px",
  fontWeight: 800,
};

const cardText = {
  marginTop: "10px",
  color: "#94a3b8",
  fontSize: "13px",
  lineHeight: 1.55,
};

const workflowPanel = {
  borderRadius: "20px",
  padding: "26px",
  background: "linear-gradient(145deg, #0b1220, #0f1e3a)",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "0 18px 36px rgba(0,0,0,0.38)",
  marginBottom: "24px",
};

const sectionHeader = {
  display: "flex",
  justifyContent: "space-between",
  gap: "24px",
  marginBottom: "22px",
};

const sectionLabel = {
  margin: 0,
  color: "#60a5fa",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  fontWeight: 800,
};

const sectionTitle = {
  margin: "6px 0 0",
  fontSize: "22px",
  fontWeight: 850,
};

const sectionDesc = {
  maxWidth: "420px",
  color: "#94a3b8",
  fontSize: "13px",
  lineHeight: 1.5,
};

const workflowGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "14px",
};

const workflowCard = {
  position: "relative" as const,
  padding: "18px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)",
};

const workflowIcon = {
  width: "42px",
  height: "42px",
  borderRadius: "13px",
  background: "rgba(16,185,129,0.12)",
  border: "1px solid rgba(16,185,129,0.22)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "14px",
};

const stepNumber = {
  position: "absolute" as const,
  top: "18px",
  right: "18px",
  color: "#334155",
  fontWeight: 900,
};

const workflowTitle = {
  margin: 0,
  fontSize: "16px",
  fontWeight: 800,
};

const workflowText = {
  marginTop: "8px",
  color: "#94a3b8",
  fontSize: "13px",
  lineHeight: 1.5,
};

const bottomGrid = {
  display: "grid",
  gridTemplateColumns: "1.4fr 1fr",
  gap: "20px",
};

const infoCard = {
  borderRadius: "20px",
  padding: "26px",
  background: "linear-gradient(145deg, #0b1220, #0f1e3a)",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "0 18px 36px rgba(0,0,0,0.38)",
};

const noticeCard = {
  borderRadius: "20px",
  padding: "26px",
  background: "rgba(16,185,129,0.08)",
  border: "1px solid rgba(16,185,129,0.18)",
  boxShadow: "0 18px 36px rgba(0,0,0,0.32)",
};

const checkList = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "12px",
  marginTop: "20px",
};

const checkItem = {
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  color: "#cbd5e1",
  fontSize: "14px",
  lineHeight: 1.5,
};