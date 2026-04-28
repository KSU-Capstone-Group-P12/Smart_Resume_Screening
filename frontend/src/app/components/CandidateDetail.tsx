import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  FileText,
  StickyNote,
} from "lucide-react";
import { Textarea } from "./ui/textarea";

const API_BASE = "http://127.0.0.1:8000";

export function CandidateDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [candidate, setCandidate] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesMessage, setNotesMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    fetch(`${API_BASE}/api/candidates/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.candidate) throw new Error("Candidate not found.");
        setCandidate(data.candidate);
        setNotes(data.candidate.recruiter_notes || "");
      })
      .catch((err) => {
        console.error("Failed to fetch candidate:", err);
        setError(
          "Candidate failed to load. Please return to the ranking dashboard and select a candidate again."
        );
      });
  }, [id]);

  const handleSaveNotes = async () => {
    if (!id) return;

    try {
      setIsSavingNotes(true);
      setNotesMessage("");

      const response = await fetch(`${API_BASE}/api/candidates/${id}/notes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recruiter_notes: notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to save recruiter notes.");
      }

      setNotesMessage("Notes saved.");
    } catch (err) {
      console.error("Failed to save notes:", err);
      setNotesMessage("Failed to save notes.");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const formatList = (value: any) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      return value
        .split(",")
        .map((v: string) => v.trim())
        .filter(Boolean);
    }
    return [];
  };

  const strengths = formatList(candidate?.strengths);
  const gaps = formatList(candidate?.gaps);

  const resumeSummaryLines = candidate?.summary
    ? [candidate.summary]
    : candidate?.resume_text
    ? candidate.resume_text
        .split("\n")
        .filter((line: string) => line.trim())
        .slice(0, 5)
    : [];

  const breakdownItems = [
    ["Overall", candidate?.score],
    ["Skills", candidate?.section_scores?.skills],
    ["Experience", candidate?.section_scores?.experience],
    ["Education", candidate?.section_scores?.education],
    ["Projects", candidate?.section_scores?.projects],
    ["Certifications", candidate?.section_scores?.certifications],
  ];

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <button onClick={() => navigate("/ranking")} style={backButton}>
          <ArrowLeft size={16} style={{ marginRight: 6 }} />
          Back to Ranking
        </button>

        {error && <div style={errorBox}>{error}</div>}

        <div style={cardStyle}>
          <p style={subTitle}>Candidate Profile</p>

          <h1 style={{ fontSize: "28px", fontWeight: 700 }}>
            {candidate?.candidate_name ||
              candidate?.name ||
              "Unnamed Candidate"}
          </h1>

          <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
            AI-assisted resume match summary for recruiter review.
          </p>

          <div style={scoreBox}>
            <p
              style={{
                fontSize: "12px",
                color: "#34d399",
                letterSpacing: "1px",
              }}
            >
              MATCH SCORE
            </p>
            <div style={{ fontSize: "40px", fontWeight: 700 }}>
              {candidate?.score || "N/A"}
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={sectionHeader}>
            <FileText color="#60a5fa" />
            <div>
              <h3 style={sectionTitle}>Resume Summary</h3>
              <p style={desc}>Quick overview of the candidate resume.</p>
            </div>
          </div>

          {resumeSummaryLines.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {resumeSummaryLines.map((line: string, idx: number) => (
                <div key={idx} style={itemBox}>
                  • {line}
                </div>
              ))}
            </div>
          ) : (
            <p style={empty}>No resume summary available yet.</p>
          )}
        </div>

        <div style={cardStyle}>
          <div style={sectionHeader}>
            <CheckCircle2 color="#34d399" />
            <div>
              <h3 style={sectionTitle}>Strengths</h3>
              <p style={desc}>Key areas where this candidate fits the role.</p>
            </div>
          </div>

          {strengths.length > 0 ? (
            <div style={grid}>
              {strengths.map((s: string, i: number) => (
                <div key={i} style={itemBox}>
                  • {s}
                </div>
              ))}
            </div>
          ) : (
            <p style={empty}>No strengths available yet.</p>
          )}
        </div>

        <div style={cardStyle}>
          <div style={sectionHeader}>
            <AlertTriangle color="#facc15" />
            <div>
              <h3 style={sectionTitle}>Skill Gaps</h3>
              <p style={desc}>Areas to verify in interview.</p>
            </div>
          </div>

          {gaps.length > 0 ? (
            <div style={grid}>
              {gaps.map((g: string, i: number) => (
                <div key={i} style={itemBox}>
                  • {g}
                </div>
              ))}
            </div>
          ) : (
            <p style={empty}>No gaps available yet.</p>
          )}
        </div>

        <div style={cardStyle}>
          <div style={sectionHeader}>
            <ClipboardList color="#60a5fa" />
            <div>
              <h3 style={sectionTitle}>Match Breakdown</h3>
              <p style={desc}>Section-level scoring summary.</p>
            </div>
          </div>

          <div style={breakdownGrid}>
            {breakdownItems.map(([label, value]) => (
              <div key={label} style={breakdownBox}>
                <p style={breakdownLabel}>{label}</p>
                <p style={breakdownValue}>{value || "N/A"}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={sectionHeader}>
            <StickyNote color="#a78bfa" />
            <div>
              <h3 style={sectionTitle}>Recruiter Notes</h3>
              <p style={desc}>Add internal notes for recruiter review.</p>
            </div>
          </div>

          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this candidate..."
            style={notesArea}
          />

          <div style={notesFooter}>
            <button
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
              style={saveButton}
            >
              {isSavingNotes ? "Saving..." : "Save Notes"}
            </button>

            {notesMessage && <span style={notesMsg}>{notesMessage}</span>}
          </div>
        </div>

        <div style={cardStyle}>
          <button
            onClick={() => navigate(`/interview/${id}`)}
            style={interviewButton}
          >
            View Interview Questions →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- style ---------- */

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

const errorBox = {
  background: "rgba(255,80,80,0.1)",
  border: "1px solid rgba(255,80,80,0.3)",
  padding: "12px 16px",
  borderRadius: "10px",
  marginBottom: "20px",
  color: "#ff6b6b",
};

const cardStyle = {
  background: "linear-gradient(145deg, #0b1220, #0f1e3a)",
  borderRadius: "16px",
  padding: "24px",
  marginBottom: "20px",
  border: "1px solid rgba(255,255,255,0.05)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
};

const scoreBox = {
  marginTop: "10px",
  padding: "20px",
  borderRadius: "14px",
  background: "rgba(16,185,129,0.1)",
  border: "1px solid rgba(16,185,129,0.2)",
  textAlign: "center" as const,
  color: "#34d399",
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

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
};

const itemBox = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "10px",
  padding: "10px 14px",
  fontSize: "14px",
  color: "#e5e7eb",
};

const breakdownGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "12px",
};

const breakdownBox = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "12px",
  padding: "16px",
};

const breakdownLabel = {
  margin: 0,
  marginBottom: "6px",
  fontSize: "11px",
  color: "#64748b",
  textTransform: "uppercase" as const,
  letterSpacing: "0.8px",
};

const breakdownValue = {
  margin: 0,
  fontSize: "18px",
  fontWeight: 700,
  color: "#ffffff",
};

const notesArea = {
  minHeight: "130px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#e5e7eb",
  borderRadius: "12px",
  padding: "12px",
  resize: "none" as const,
};

const notesFooter = {
  marginTop: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const saveButton = {
  padding: "10px 14px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff",
  cursor: "pointer",
};

const interviewButton = {
  width: "100%",
  padding: "14px 18px",
  borderRadius: "12px",
  background: "rgba(16,185,129,0.15)",
  border: "1px solid rgba(16,185,129,0.25)",
  color: "#a7f3d0",
  fontWeight: 700,
  cursor: "pointer",
};

const notesMsg = {
  color: "#94a3b8",
  fontSize: "12px",
};

const subTitle = {
  fontSize: "12px",
  color: "#64748b",
  marginBottom: "6px",
};

const desc = {
  fontSize: "12px",
  color: "#64748b",
};

const empty = {
  color: "#64748b",
  fontSize: "14px",
};