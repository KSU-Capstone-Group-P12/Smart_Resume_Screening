import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

const API_BASE = "http://127.0.0.1:8000";

type Candidate = {
  id: string;
  rank: number;
  name: string;
  score: string;
  skills: string;
  gaps: string;
};

export function AllScreens() {
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [jobRes, candidatesRes] = await Promise.all([
          fetch(`${API_BASE}/api/jobs/current`),
          fetch(`${API_BASE}/api/jobs/current/candidates`),
        ]);

        const jobData = await jobRes.json();
        const candidatesData = await candidatesRes.json();

        setJobDescription(
          jobData.job_description || "No job description uploaded yet."
        );
        setCandidates(candidatesData.candidates || []);
      } catch (error) {
        console.error("Failed to load all screens data:", error);
        setJobDescription("Failed to load job description.");
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const topCandidate = candidates.length > 0 ? candidates[0] : null;

  return (
    <div className="min-h-screen bg-[#2a2a2a] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-white tracking-wide">
            Complete System Snapshot
          </h1>
          <div className="w-32"></div>
        </div>

        {/* Status Summary */}
        <div className="bg-[#3a3a3a] border-2 border-[#4a4a4a] rounded-lg p-6">
          <h2 className="text-white font-bold mb-4 text-lg">Current System State</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
              <div className="text-gray-400 text-xs mb-2">Job Description</div>
              <div className="text-white font-medium">
                {jobDescription ? "Loaded" : "Not Loaded"}
              </div>
            </div>
            <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
              <div className="text-gray-400 text-xs mb-2">Candidates Processed</div>
              <div className="text-white font-medium">{candidates.length}</div>
            </div>
            <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
              <div className="text-gray-400 text-xs mb-2">Top Candidate</div>
              <div className="text-white font-medium">
                {topCandidate ? topCandidate.name : "No candidates yet"}
              </div>
            </div>
          </div>
        </div>

        {/* All Screens Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Screen 1 */}
          <div
            className="bg-[#3a3a3a] border-2 border-[#4a4a4a] rounded-lg p-6 cursor-pointer hover:border-[#6a6a6a] transition-all"
            onClick={() => navigate("/job-upload")}
          >
            <h3 className="text-white font-bold mb-4 text-sm">
              SCREEN 1: JOB DESCRIPTION + UPLOAD
            </h3>
            <div className="space-y-3">
              <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-3 min-h-[90px] text-xs text-gray-300">
                {loading ? "Loading..." : jobDescription}
              </div>
              <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-3 text-xs text-gray-300">
                Files/Candidates ready for review: {candidates.length}
              </div>
            </div>
          </div>

          {/* Screen 2 */}
          <div
            className="bg-[#3a3a3a] border-2 border-[#4a4a4a] rounded-lg p-6 cursor-pointer hover:border-[#6a6a6a] transition-all"
            onClick={() => navigate("/processing")}
          >
            <h3 className="text-white font-bold mb-4 text-sm">SCREEN 2: PROCESSING</h3>
            <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-6">
              <div className="text-white text-center mb-4 text-xs">
                Processing Candidates...
              </div>
              <div className="space-y-2">
                <div className="bg-[#5a5a5a] rounded p-2 text-xs text-gray-300">
                  Upload and parsing pipeline connected
                </div>
                <div className="bg-[#5a5a5a] rounded p-2 text-xs text-gray-300">
                  LLM scoring pipeline active
                </div>
                <div className="bg-[#5a5a5a] rounded p-2 text-xs text-gray-300">
                  Database write flow enabled
                </div>
              </div>
            </div>
          </div>

          {/* Screen 3 */}
          <div
            className="bg-[#3a3a3a] border-2 border-[#4a4a4a] rounded-lg p-6 cursor-pointer hover:border-[#6a6a6a] transition-all"
            onClick={() => navigate("/ranking")}
          >
            <h3 className="text-white font-bold mb-4 text-sm">
              SCREEN 3: CANDIDATE RANKING DASHBOARD
            </h3>
            <div className="space-y-3">
              {loading ? (
                <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-3 text-xs text-gray-300">
                  Loading candidates...
                </div>
              ) : candidates.length === 0 ? (
                <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-3 text-xs text-gray-400">
                  No candidates available yet.
                </div>
              ) : (
                candidates.slice(0, 4).map((candidate) => (
                  <div
                    key={candidate.id}
                    className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-3 text-xs text-gray-300"
                  >
                    <div className="text-white font-medium">
                      #{candidate.rank} {candidate.name}
                    </div>
                    <div>Score: {candidate.score}</div>
                    <div>Skills: {candidate.skills || "N/A"}</div>
                    <div>Gaps: {candidate.gaps || "N/A"}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Screen 4 */}
          <div
            className="bg-[#3a3a3a] border-2 border-[#4a4a4a] rounded-lg p-6 cursor-pointer hover:border-[#6a6a6a] transition-all"
            onClick={() => navigate(topCandidate ? `/candidate/${topCandidate.id}` : "/ranking")}
          >
            <h3 className="text-white font-bold mb-4 text-sm">
              SCREEN 4: CANDIDATE DETAIL VIEW
            </h3>
            <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4 min-h-[180px] text-xs text-gray-300">
              {topCandidate ? (
                <div className="space-y-2">
                  <div className="text-white font-medium">{topCandidate.name}</div>
                  <div>Score: {topCandidate.score}</div>
                  <div>Strengths: {topCandidate.skills || "N/A"}</div>
                  <div>Gaps: {topCandidate.gaps || "N/A"}</div>
                  <div className="pt-2 text-gray-400">
                    Click to open full candidate detail view
                  </div>
                </div>
              ) : (
                <div>No candidate detail available yet.</div>
              )}
            </div>
          </div>

          {/* Screen 5 */}
          <div
            className="bg-[#3a3a3a] border-2 border-[#4a4a4a] rounded-lg p-6 cursor-pointer hover:border-[#6a6a6a] transition-all lg:col-span-2"
            onClick={() => navigate(topCandidate ? `/interview/${topCandidate.id}` : "/ranking")}
          >
            <h3 className="text-white font-bold mb-4 text-sm">
              SCREEN 5: INTERVIEW QUESTIONS + ETHICAL FRAMEWORK
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-3 text-xs text-gray-300 min-h-[120px]">
                  {topCandidate ? (
                    <>
                      <div className="text-white font-medium mb-2">
                        Candidate: {topCandidate.name}
                      </div>
                      <div>Question generation ready from processed candidate data.</div>
                      <div className="mt-2 text-gray-400">
                        Click to open interview question screen.
                      </div>
                    </>
                  ) : (
                    <div>No candidate selected yet.</div>
                  )}
                </div>
              </div>
              <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
                <div className="text-white text-xs mb-3">ETHICAL & FAIRNESS PANEL</div>
                <div className="space-y-2 text-xs text-gray-300">
                  <div className="bg-[#5a5a5a] rounded p-2">
                    Human-in-the-loop decision support
                  </div>
                  <div className="bg-[#5a5a5a] rounded p-2">
                    Explainable ranking outputs
                  </div>
                  <div className="bg-[#5a5a5a] rounded p-2">
                    No automatic rejection decisions
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-[#3a3a3a] border-2 border-[#4a4a4a] rounded-lg p-6">
          <h2 className="text-white font-bold mb-4 text-lg">Live Integration Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
            <div>
              <h3 className="font-bold text-white mb-2">Current Connected Features</h3>
              <ul className="space-y-1 text-xs">
                <li>• Job description upload</li>
                <li>• Resume file ingestion</li>
                <li>• LLM candidate scoring</li>
                <li>• Candidate ranking output</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">System Snapshot Purpose</h3>
              <ul className="space-y-1 text-xs">
                <li>• Shows current backend-connected state</li>
                <li>• Summarizes uploaded and processed data</li>
                <li>• Provides quick navigation into working screens</li>
                <li>• Useful for presentation/demo flow</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}