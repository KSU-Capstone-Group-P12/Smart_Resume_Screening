import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { X, ArrowLeft } from "lucide-react";

const API_BASE = "http://127.0.0.1:8000";

export function JobUpload() {
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const uploadJobDescription = async () => {
    const response = await fetch(
      `${API_BASE}/api/jobs/upload?job_title=${encodeURIComponent(
        jobTitle
      )}&job_text=${encodeURIComponent(jobDescription)}`,
      { method: "POST" }
    );

    if (!response.ok) {
      throw new Error("Failed to upload the job description.");
    }

    return response.json();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  };

  const removeFile = (fileName: string) => {
    setSelectedFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  const handleStartAnalysis = async () => {
    if (isSubmitting) return;

    setErrorMessage("");

    if (!jobTitle.trim()) {
      setErrorMessage("Please enter a job title.");
      return;
    }

    if (!jobDescription.trim()) {
      setErrorMessage("Please enter a job description.");
      return;
    }

    if (selectedFiles.length === 0) {
      setErrorMessage("Please upload at least one resume.");
      return;
    }

    try {
      setIsSubmitting(true);

      const jobData = await uploadJobDescription();
      const jobId = jobData.job_id;

      const successfulUploads: string[] = [];

      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("job_id", jobId);

        const response = await fetch(`${API_BASE}/api/resumes/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Resume upload failed for ${file.name}: ${errorText}`);
        }

        const data = await response.json();
        successfulUploads.push(data.candidate?.candidate_name || file.name);
      }

      setUploadedFiles(successfulUploads);
      setSelectedFiles([]);
      navigate("/ranking");
    } catch (error) {
      console.error("Start analysis error:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while starting the analysis."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Button variant="ghost" onClick={() => navigate("/")} style={backButton}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Overview
        </Button>

        <div style={headerCard}>
          <p style={subTitle}>New Screening</p>
          <h1 style={mainTitle}>Create New Job Screening</h1>
          <p style={desc}>
            Upload a job description and candidate resumes to generate AI-assisted rankings.
          </p>
        </div>

        <div style={card}>
          <h2 style={title}>Job Information</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Enter job title..."
              style={input}
              disabled={isSubmitting}
            />

            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description..."
              style={textarea}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div style={card}>
          <h2 style={title}>Upload Resumes</h2>

          <div style={dropZone}>
            <input
              type="file"
              id="file-upload"
              multiple
              accept=".pdf,.docx"
              onChange={handleFileUpload}
              style={{ display: "none" }}
              disabled={isSubmitting}
            />

            <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
              <p style={{ margin: 0, color: "#e5e7eb", fontWeight: 600 }}>
                Drag and drop PDF or DOCX files here
              </p>
              <p style={{ marginTop: "6px", fontSize: "12px", color: "#64748b" }}>
                Or click to choose files from your computer
              </p>
            </label>
          </div>

          <Button
            onClick={() => document.getElementById("file-upload")?.click()}
            disabled={isSubmitting}
            style={secondaryBtn}
          >
            Upload Resumes
          </Button>

          {selectedFiles.length > 0 && (
            <div style={{ marginTop: "16px" }}>
              {selectedFiles.map((file) => (
                <div key={file.name} style={fileItem}>
                  <span style={{ color: "#e5e7eb", fontSize: "13px" }}>
                    {file.name}
                  </span>

                  <button
                    onClick={() => removeFile(file.name)}
                    disabled={isSubmitting}
                    style={removeBtn}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {errorMessage && <div style={errorBox}>{errorMessage}</div>}

        <div style={card}>
          <Button
            onClick={handleStartAnalysis}
            disabled={isSubmitting}
            style={{
              ...mainBtn,
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "Processing resumes..." : "Start Analysis"}
          </Button>
        </div>

        {uploadedFiles.length > 0 && (
          <div style={successBox}>
            Uploaded {uploadedFiles.length} resume(s) successfully.
          </div>
        )}

        <div style={noticeBox}>
          Notice: This system provides decision support only. No candidates are automatically rejected.
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
};

const headerCard = {
  background: "linear-gradient(145deg, #0b1220, #0f1e3a)",
  borderRadius: "16px",
  padding: "28px",
  marginBottom: "20px",
  border: "1px solid rgba(255,255,255,0.05)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
};

const card = {
  background: "linear-gradient(145deg, #0b1220, #0f1e3a)",
  borderRadius: "16px",
  padding: "24px",
  marginBottom: "20px",
  border: "1px solid rgba(255,255,255,0.05)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
};

const subTitle = {
  fontSize: "12px",
  color: "#64748b",
  marginBottom: "6px",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
};

const mainTitle = {
  margin: 0,
  fontSize: "30px",
  fontWeight: 800,
};

const title = {
  fontSize: "18px",
  fontWeight: 700,
  marginBottom: "14px",
};

const desc = {
  fontSize: "13px",
  color: "#94a3b8",
  marginTop: "8px",
};

const input = {
  padding: "12px 14px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#fff",
  outline: "none",
  fontSize: "14px",
};

const textarea = {
  minHeight: "150px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#fff",
  outline: "none",
  fontSize: "14px",
  borderRadius: "12px",
};

const dropZone = {
  border: "2px dashed rgba(255,255,255,0.18)",
  padding: "34px",
  borderRadius: "14px",
  textAlign: "center" as const,
  background: "rgba(255,255,255,0.03)",
  marginBottom: "12px",
};

const secondaryBtn = {
  marginTop: "10px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#e5e7eb",
};

const fileItem = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.06)",
  padding: "10px 12px",
  borderRadius: "10px",
  marginBottom: "8px",
};

const removeBtn = {
  background: "transparent",
  border: "none",
  color: "#cbd5e1",
  cursor: "pointer",
};

const mainBtn = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  background: "rgba(16,185,129,0.18)",
  border: "1px solid rgba(16,185,129,0.28)",
  color: "#a7f3d0",
  fontWeight: 700,
};

const errorBox = {
  background: "rgba(255,80,80,0.1)",
  border: "1px solid rgba(255,80,80,0.3)",
  padding: "12px 16px",
  borderRadius: "10px",
  marginBottom: "20px",
  color: "#ff6b6b",
};

const successBox = {
  background: "rgba(16,185,129,0.1)",
  border: "1px solid rgba(16,185,129,0.3)",
  padding: "12px 16px",
  borderRadius: "10px",
  color: "#34d399",
  marginBottom: "20px",
};

const noticeBox = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)",
  padding: "12px 16px",
  borderRadius: "10px",
  color: "#94a3b8",
  fontSize: "12px",
};