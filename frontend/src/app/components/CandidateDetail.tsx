import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ArrowLeft } from "lucide-react";
import { WireframeLayout } from "./WireframeLayout";

const API_BASE = "http://127.0.0.1:8000";

export function CandidateDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [notes, setNotes] = useState("");
  const [candidate, setCandidate] = useState<any>(null);
  const [error, setError] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesMessage, setNotesMessage] = useState("");

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

useEffect(() => {
  if (!id) return;

  fetch(`${API_BASE}/api/candidates/${id}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.candidate) {
        throw new Error("Candidate not found.");
      }
      setCandidate(data.candidate);
      setNotes(data.candidate.recruiter_notes || "");
    })
    .catch((err) => {
      console.error("Failed to fetch candidate:", err);
      setError("Candidate failed to load. Please return to the ranking dashboard and select a candidate again.");
    });
}, [id]);

  return (
    <WireframeLayout title="SCREEN 4: CANDIDATE DETAIL VIEW">
    <div className="space-y-6">
      {error && (
        <div className="bg-[#5a3a3a] border border-[#7a4a4a] rounded p-3 text-red-200 text-xs">
          {error}
        </div>
      )}
      
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-gray-300 hover:text-white text-xs"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Overview
          </Button>
          <div className="flex gap-2 items-center">
            <div className="bg-[#5a5a5a] border border-[#6a6a6a] px-3 py-1 rounded text-white text-xs">
              Candidate: {candidate?.candidate_name || "Loading..."}
            </div>
            <div className="bg-[#5a5a5a] border border-[#6a6a6a] px-3 py-1 rounded text-white text-xs">
              Score: {candidate?.score || "N/A"}
            </div>
            <Button
            variant="outline"
            onClick={() => navigate("/ranking")}
            className="bg-[#5a5a5a] border-[#6a6a6a] text-white text-xs h-auto px-3 py-1"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Resume Summary */}
            <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
              <h2 className="text-white font-bold mb-3 text-sm tracking-wide">Resume Summary</h2>
              <div className="space-y-2 text-xs text-gray-300">
                {candidate?.summary ? (
                  <p>{candidate.summary}</p>
                ) : candidate?.resume_text ? (
                  candidate.resume_text
                  .split("\n")
                  .filter((line: string) => line.trim())
                  .slice(0, 5)
                  .map((line: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{line}</span>
                    </div>
                  ))
              ) : (
                <div className="flex items-start gap-2">
                  <span>•</span>
                  <span>No resume summary available yet.</span>
                </div>
              )}
            </div>
          </div>

            {/* Match Breakdown */}
            <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
              <h2 className="text-white font-bold mb-3 text-sm tracking-wide">
                Match Breakdown: ⬆
              </h2>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#5a5a5a] border border-[#6a6a6a] rounded p-2">
                  <div className="text-gray-400 text-[10px]">Overall Score</div>
                  <div className="text-white">{candidate?.score ?? "N/A"}</div>
                </div>
                  <div className="bg-[#5a5a5a] border border-[#6a6a6a] rounded p-2">
                    <div className="text-gray-400 text-[10px]">Skills</div>
                    <div className="text-white">{candidate?.section_scores?.skills ?? "N/A"}</div>
              </div>
              <div className="bg-[#5a5a5a] border border-[#6a6a6a] rounded p-2">
                <div className="text-gray-400 text-[10px]">Experience</div>
                <div className="text-white">{candidate?.section_scores?.experience ?? "N/A"}</div>
              </div>
              <div className="bg-[#5a5a5a] border border-[#6a6a6a] rounded p-2">
                <div className="text-gray-400 text-[10px]">Education</div>
                <div className="text-white">{candidate?.section_scores?.education ?? "N/A"}</div>
              </div>
              <div className="bg-[#5a5a5a] border border-[#6a6a6a] rounded p-2">
                <div className="text-gray-400 text-[10px]">Projects</div>
                <div className="text-white">{candidate?.section_scores?.projects ?? "N/A"}</div>
              </div>
                <div className="bg-[#5a5a5a] border border-[#6a6a6a] rounded p-2">
                <div className="text-gray-400 text-[10px]">Certifications</div>
                <div className="text-white">{candidate?.section_scores?.certifications ?? "N/A"}</div>
              </div>
            </div>
          </div>

            {/* Strengths and Skill Gaps */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
                <h3 className="text-white font-bold mb-2 text-sm">Strengths</h3>
                <ul className="space-y-1 text-xs text-gray-300">
                  {(candidate?.strengths || []).length > 0 ? (
                    candidate.strengths.map((strength: string, idx: number) => (
                    <li key={idx}>• {strength}</li>
                  ))
                ) : (
                  <li>• No strengths available yet</li>
                )}
              </ul>
              </div>
              <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
                <h3 className="text-white font-bold mb-2 text-sm">Skill Gaps</h3>
                <ul className="space-y-1 text-xs text-gray-300">
                  {(candidate?.gaps || []).length > 0 ? (
                    candidate.gaps.map((gap: string, idx: number) => (
                      <li key={idx}>• {gap}</li>
                    ))
                  ) : (
                    <li>• No gaps available yet</li>
                  )}
              </ul>
              </div>
            </div>
          </div>
{/* Right Column */}
<div className="space-y-6">
  {/* Recruiter Notes */}
  <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
    <h2 className="text-white font-bold mb-3 text-sm tracking-wide">
      Recruiter Notes
    </h2>

    <div className="bg-[#5a5a5a] border border-[#6a6a6a] rounded p-3 mb-3 min-h-[120px]">
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Recruiter Notes"
        className="bg-transparent border-none text-gray-300 text-xs min-h-[100px] resize-none"
      />
    </div>

    <div className="flex items-center justify-between mt-3">
      <Button
        variant="outline"
        onClick={handleSaveNotes}
        disabled={isSavingNotes}
        className="bg-[#5a5a5a] border-[#6a6a6a] text-white text-xs"
      >
        {isSavingNotes ? "Saving..." : "Save Notes"}
      </Button>

      {notesMessage && (
        <span className="text-xs text-gray-400">{notesMessage}</span>
      )}
    </div>
  </div>

  {/* View Interview Questions */}
  <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
    <Button
      variant="outline"
      onClick={() => navigate(`/interview/${id || "2"}`)}
      className="bg-[#5a5a5a] border-[#6a6a6a] text-white text-xs w-full"
    >
      View Interview Questions →
    </Button>
  </div>
</div>
        </div>
      </div>
    </WireframeLayout>
  );
}
