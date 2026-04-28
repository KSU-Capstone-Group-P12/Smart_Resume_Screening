import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Loader2, Sparkles, MessageSquareText } from "lucide-react";

const API_BASE = "http://127.0.0.1:8000";

export function InterviewQuestions() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [candidateName, setCandidateName] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const parseQuestions = (text: string) => {
    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  };

  useEffect(() => {
    if (!id) return;

    fetch(`${API_BASE}/api/candidates/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCandidateName(data?.candidate?.candidate_name || "Candidate");
      })
      .catch(() => {
        setError("Failed to load candidate.");
      });
  }, [id]);

  const generateQuestions = async () => {
    if (!id) return;

    setLoading(true);
    setError("");
    setQuestions([]);

    try {
      const res = await fetch(
        `${API_BASE}/api/candidates/${id}/interview-questions`,
        { method: "POST" }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to generate questions");
      }

      setQuestions(parseQuestions(data.questions));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <button onClick={() => navigate("/ranking")} style={backButton}>
          <ArrowLeft size={16} style={{ marginRight: 6 }} />
          Back to Ranking
        </button>

        <div style={headerCard}>
          <div>
            <p style={subTitle}>Interview Support</p>
            <h1 style={title}>Interview Questions</h1>
            <p style={desc}>
              Generate AI-assisted interview questions for{" "}
              <span style={{ color: "#ffffff", fontWeight: 700 }}>
                {candidateName || "Candidate"}
              </span>
              .
            </p>
          </div>

          <div style={iconBox}>
            <MessageSquareText size={30} color="#60a5fa" />
          </div>
        </div>

        {error && <div style={errorBox}>{error}</div>}

        <div style={cardStyle}>
          <div style={sectionHeader}>
            <Sparkles color="#34d399" />
            <div>
              <h3 style={sectionTitle}>Generate Questions</h3>
              <p style={desc}>
                Questions are based on the candidate profile, role requirements,
                strengths, and gaps.
              </p>
            </div>
          </div>

          <button
            onClick={generateQuestions}
            disabled={loading}
            style={{
              ...generateButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  style={{
                    marginRight: 8,
                    animation: "spin 1s linear infinite",
                  }}
                />
                Generating...
              </>
            ) : (
              "Generate Interview Questions"
            )}
          </button>
        </div>

        <div style={cardStyle}>
          <div style={sectionHeader}>
            <MessageSquareText color="#60a5fa" />
            <div>
              <h3 style={sectionTitle}>Suggested Questions</h3>
              <p style={desc}>
                Recruiters can use these questions to validate skills and clarify
                gaps.
              </p>
            </div>
          </div>

          {questions.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {questions.map((q, i) => (
                <div key={i} style={questionBox}>
                  <div style={questionNumber}>{i + 1}</div>
                  <p style={questionText}>{q}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={emptyBox}>
              No questions generated yet. Click the button above to generate
              interview questions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- styles ---------- */

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #020617, #071426, #0f172a)",
  padding: "32px",
  color: "#fff",
};

const backButton = {
  marginBottom: "20px",
  padding: "10px 16px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#fff",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
};

const headerCard = {
  background: "linear-gradient(145deg, #0b1220, #0f1e3a)",
  borderRadius: "16px",
  padding: "28px",
  marginBottom: "20px",
  border: "1px solid rgba(255,255,255,0.05)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const cardStyle = {
  background: "linear-gradient(145deg, #0b1220, #0f1e3a)",
  borderRadius: "16px",
  padding: "24px",
  marginBottom: "20px",
  border: "1px solid rgba(255,255,255,0.05)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
};

const sectionHeader = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "18px",
};

const sectionTitle = {
  margin: 0,
  fontSize: "18px",
  fontWeight: 700,
};

const subTitle = {
  fontSize: "12px",
  color: "#64748b",
  marginBottom: "6px",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
};

const title = {
  margin: 0,
  fontSize: "30px",
  fontWeight: 800,
};

const desc = {
  fontSize: "13px",
  color: "#94a3b8",
  marginTop: "6px",
};

const iconBox = {
  width: "64px",
  height: "64px",
  borderRadius: "16px",
  background: "rgba(96,165,250,0.12)",
  border: "1px solid rgba(96,165,250,0.22)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const generateButton = {
  width: "100%",
  padding: "14px 18px",
  borderRadius: "12px",
  background: "rgba(16,185,129,0.15)",
  border: "1px solid rgba(16,185,129,0.25)",
  color: "#a7f3d0",
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const questionBox = {
  display: "flex",
  gap: "14px",
  alignItems: "flex-start",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "12px",
  padding: "16px",
};

const questionNumber = {
  minWidth: "30px",
  height: "30px",
  borderRadius: "999px",
  background: "rgba(96,165,250,0.16)",
  border: "1px solid rgba(96,165,250,0.28)",
  color: "#bfdbfe",
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const questionText = {
  margin: 0,
  color: "#e5e7eb",
  fontSize: "14px",
  lineHeight: 1.5,
};

const emptyBox = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "12px",
  padding: "18px",
  color: "#94a3b8",
  fontSize: "14px",
  textAlign: "center" as const,
};

const errorBox = {
  background: "rgba(255,80,80,0.1)",
  border: "1px solid rgba(255,80,80,0.3)",
  padding: "12px 16px",
  borderRadius: "10px",
  marginBottom: "20px",
  color: "#ff6b6b",
};