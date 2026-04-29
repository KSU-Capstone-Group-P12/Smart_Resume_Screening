import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Trophy, Medal, Upload } from "lucide-react";

type Candidate = {
  id: string;
  rank: number;
  name: string;
  score: string;
  skills: string | string[];
  gaps: string | string[];
};

const API_BASE = "http://127.0.0.1:8000";

export function CandidateRanking() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobs, setJobs] = useState<{ id: string; title: string; description: string }[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/jobs`)
      .then((res) => res.json())
      .then((data) => {
        const jobsList = data.jobs || [];
        setJobs(jobsList);

        if (jobsList.length > 0) {
          setSelectedJobId(jobsList[0].id);
          setJobTitle(jobsList[0].title);
        }
      })
      .catch((err) => console.error("Failed to fetch jobs:", err));
  }, []);

  useEffect(() => {
    if (!selectedJobId) return;

    fetch(`${API_BASE}/api/jobs/${selectedJobId}/candidates`)
      .then((res) => res.json())
      .then((data) => {
        const list = data.candidates || [];
        setCandidates(list);
        setSelectedId(list.length > 0 ? list[0].id : null);
      })
      .catch((err) => console.error("Failed to fetch candidates:", err));
  }, [selectedJobId]);

  const formatList = (value: string | string[]) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return value.split(",").map((v) => v.trim()).filter(Boolean);
  };

  const getScore = (score: string) => parseFloat(score.replace("%", "")) || 0;

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy size={18} color="#facc15" />;
    if (rank === 2) return <Medal size={18} color="#cbd5e1" />;
    if (rank === 3) return <Medal size={18} color="#fb923c" />;
    return null;
  };

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: "1150px", margin: "0 auto" }}>
        <button onClick={() => navigate("/overview")} style={backButton}>
          <ArrowLeft size={16} style={{ marginRight: 6 }} />
          Back to Overview
        </button>

        <div style={headerCard}>
          <div>
            <p style={subTitle}>Recruiter Dashboard</p>
            <h1 style={title}>Candidate Ranking</h1>
            <p style={desc}>
              Review ranked candidates with AI-assisted scores, strengths, and skill gaps.
            </p>
          </div>

          <div style={topControls}>
            <span style={roleLabel}>Role:</span>

            <select
              value={selectedJobId}
              onChange={(e) => {
                const newJobId = e.target.value;
                setSelectedJobId(newJobId);
                const selectedJob = jobs.find((job) => job.id === newJobId);
                setJobTitle(selectedJob?.title || "Selected Job");
              }}
              style={selectStyle}
            >
              {jobs.map((job) => (
                <option
                  key={job.id}
                  value={job.id}
                  style={{ backgroundColor: "#0f172a", color: "#ffffff" }}
                >
                  {job.title}
                </option>
              ))}
            </select>

            <button onClick={() => navigate("/job-upload")} style={uploadButton}>
              <Upload size={15} />
              Upload More
            </button>
          </div>
        </div>

        <div style={noticeCard}>
          Human-in-the-loop notice: This system provides decision support only. Recruiters remain responsible for final decisions.
        </div>

        <div style={listWrapper}>
          {candidates.length === 0 ? (
            <div style={emptyState}>No candidates available for this role yet.</div>
          ) : (
            candidates.map((c) => {
              const score = getScore(c.score);
              const strengths = formatList(c.skills);
              const gaps = formatList(c.gaps);

              return (
                <div
                  key={c.id}
                  style={{
                    ...card,
                    ...(selectedId === c.id ? selectedCard : {}),
                    ...(c.rank <= 3 ? topCard : {}),
                  }}
                  onClick={() => setSelectedId(c.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 24px 48px rgba(0,0,0,0.55)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 18px 36px rgba(0,0,0,0.45)";
                  }}
                >
                  <div style={rankBox}>
                    {getRankIcon(c.rank)}
                    <span>#{c.rank}</span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={rowTop}>
                      <div>
                        <h2 style={candidateName}>{c.name}</h2>
                        <p style={candidateSubText}>
                          {c.rank <= 3 ? "Top candidate match" : "Candidate profile"}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/candidate/${c.id}`);
                        }}
                        style={openBtn}
                      >
                        Open
                      </button>
                    </div>

                    <div style={{ marginTop: "12px" }}>
                      <div style={scoreRow}>
                        <span style={{ color: "#94a3b8" }}>Match Score</span>
                        <span style={{ color: "#34d399", fontWeight: 800 }}>{c.score}</span>
                      </div>

                      <div style={progressTrack}>
                        <div style={{ ...progressFill, width: `${Math.min(score, 100)}%` }} />
                      </div>
                    </div>

                    <div style={grid}>
                      <div style={miniPanel}>
                        <p style={miniTitle}>Strengths</p>
                        <div style={tagWrap}>
                          {strengths.slice(0, 3).map((s, i) => (
                            <span key={i} style={greenTag}>{s}</span>
                          ))}
                          {strengths.length > 3 && (
                            <span style={moreTag}>+{strengths.length - 3} more</span>
                          )}
                        </div>
                      </div>

                      <div style={miniPanel}>
                        <p style={miniTitle}>Gaps</p>
                        <div style={tagWrap}>
                          {gaps.slice(0, 3).map((g, i) => (
                            <span key={i} style={yellowTag}>{g}</span>
                          ))}
                          {gaps.length > 3 && (
                            <span style={moreTag}>+{gaps.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
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
  padding: "26px",
  borderRadius: "18px",
  marginBottom: "18px",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
};

const subTitle = {
  margin: 0,
  fontSize: "12px",
  color: "#64748b",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
};

const title = {
  margin: "6px 0 0",
  fontSize: "30px",
  fontWeight: 800,
};

const desc = {
  marginTop: "8px",
  color: "#94a3b8",
  fontSize: "13px",
};

const topControls = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const roleLabel = {
  padding: "10px 12px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#cbd5e1",
  fontSize: "13px",
  fontWeight: 700,
};

const selectStyle = {
  minWidth: "210px",
  padding: "10px 12px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff",
  outline: "none",
};

const uploadButton = {
  padding: "10px 13px",
  borderRadius: "10px",
  background: "rgba(16,185,129,0.15)",
  border: "1px solid rgba(16,185,129,0.25)",
  color: "#a7f3d0",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "7px",
  fontWeight: 700,
};

const noticeCard = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "14px",
  padding: "14px 16px",
  color: "#94a3b8",
  fontSize: "13px",
  marginBottom: "18px",
};

const listWrapper = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "16px",
};

const card = {
  display: "flex",
  gap: "18px",
  padding: "20px",
  borderRadius: "18px",
  background: "linear-gradient(145deg, #0b1220, #0f1e3a)",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "0 18px 36px rgba(0,0,0,0.45)",
  transition: "all 0.25s ease",
  cursor: "pointer",
};

const selectedCard = {
  border: "1px solid rgba(96,165,250,0.35)",
};

const topCard = {
  border: "1px solid rgba(250,204,21,0.22)",
};

const rankBox = {
  minWidth: "74px",
  height: "38px",
  padding: "8px 10px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  fontWeight: 800,
};

const rowTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

const candidateName = {
  margin: 0,
  fontSize: "20px",
  fontWeight: 800,
};

const candidateSubText = {
  marginTop: "4px",
  fontSize: "12px",
  color: "#64748b",
};

const openBtn = {
  padding: "9px 14px",
  borderRadius: "12px",
  background: "rgba(16,185,129,0.15)",
  border: "1px solid rgba(16,185,129,0.25)",
  color: "#a7f3d0",
  fontWeight: 700,
  cursor: "pointer",
};

const scoreRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "8px",
  fontSize: "13px",
};

const progressTrack = {
  height: "9px",
  background: "rgba(255,255,255,0.1)",
  borderRadius: "999px",
  overflow: "hidden",
};

const progressFill = {
  height: "100%",
  background: "linear-gradient(90deg,#34d399,#60a5fa)",
  borderRadius: "999px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "14px",
  marginTop: "16px",
};

const miniPanel = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "14px",
  padding: "14px",
};

const miniTitle = {
  margin: "0 0 10px",
  fontSize: "12px",
  color: "#94a3b8",
  textTransform: "uppercase" as const,
  letterSpacing: "0.7px",
};

const tagWrap = {
  display: "flex",
  gap: "7px",
  flexWrap: "wrap" as const,
};

const greenTag = {
  background: "rgba(16,185,129,0.16)",
  border: "1px solid rgba(16,185,129,0.24)",
  color: "#a7f3d0",
  padding: "5px 9px",
  borderRadius: "999px",
  fontSize: "12px",
};

const yellowTag = {
  background: "rgba(250,204,21,0.13)",
  border: "1px solid rgba(250,204,21,0.22)",
  color: "#fde68a",
  padding: "5px 9px",
  borderRadius: "999px",
  fontSize: "12px",
};

const moreTag = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#cbd5e1",
  padding: "5px 9px",
  borderRadius: "999px",
  fontSize: "12px",
};

const emptyState = {
  background: "linear-gradient(145deg, #0b1220, #0f1e3a)",
  borderRadius: "16px",
  padding: "28px",
  border: "1px solid rgba(255,255,255,0.06)",
  color: "#94a3b8",
  textAlign: "center" as const,
};