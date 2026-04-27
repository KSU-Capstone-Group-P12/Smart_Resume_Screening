import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { WireframeLayout } from "./WireframeLayout";

type Candidate = {
  id: string;
  rank: number;
  name: string;
  score: string;
  skills: string;
  gaps: string;
};

const API_BASE = "http://127.0.0.1:8000"

export function CandidateRanking() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobTitle, setJobTitle] = useState("Data Analyst");
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
    .catch((err) => {
      console.error("Failed to fetch jobs:", err);
    });
}, []);

useEffect(() => {
  if (!selectedJobId) return;

  fetch(`${API_BASE}/api/jobs/${selectedJobId}/candidates`)
    .then((res) => res.json())
    .then((data) => {
      setCandidates(data.candidates || []);

      if (data.candidates && data.candidates.length > 0) {
        setSelectedId(data.candidates[0].id);
      } else {
        setSelectedId(null);
      }
    })
    .catch((err) => {
      console.error("Failed to fetch candidates:", err);
    });
}, [selectedJobId]);

  return (
    <WireframeLayout title="CANDIDATE RANKING DASHBOARD">
      <div className="space-y-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/overview")}
            className="text-gray-300 hover:text-white text-xs"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Overview
          </Button>
          <div className="flex gap-2">
            <div className="bg-[#5a5a5a] border border-[#6a6a6a] px-3 py-1 rounded text-white text-xs">
              Job
            </div>
            <div className="bg-[#5a5a5a] border border-[#6a6a6a] px-3 py-1 rounded text-white text-xs">
              <select
                value={selectedJobId}
                onChange={(e) => {
                  const newJobId = e.target.value;
                  setSelectedJobId(newJobId);
                  const selectedJob = jobs.find((job) => job.id === newJobId);
                  setJobTitle(selectedJob?.title || "Selected Job");
                }}
                className="bg-transparent text-white text-xs outline-none"> 
                {jobs.map((job) => (
                  <option key={job.id} value={job.id} className="text-black">
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-[#5a5a5a] border border-[#6a6a6a] px-3 py-1 rounded text-white text-xs">
              Upload More
            </div>
            <div className="bg-[#5a5a5a] border border-[#6a6a6a] px-3 py-1 rounded text-white text-xs">
              Back to Jobs
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-3">
          <p className="text-gray-300 text-xs">Human-in-the-Loop Notice</p>
        </div>

        {/* Main Content */}
        <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
          <h2 className="text-white font-bold mb-4 text-sm tracking-wide">
            Human-in-the-Loop Notice
          </h2>

          {/* Table */}
          <div className="bg-[#5a5a5a] border border-[#6a6a6a] rounded overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#6a6a6a]">
                  <th className="text-left text-gray-300 p-2 font-normal">Rank</th>
                  <th className="text-left text-gray-300 p-2 font-normal">Name</th>
                  <th className="text-left text-gray-300 p-2 font-normal">Score</th>
                  <th className="text-left text-gray-300 p-2 font-normal">Strengths</th>
                  <th className="text-left text-gray-300 p-2 font-normal">Gaps</th>
                  <th className="text-left text-gray-300 p-2 font-normal">View</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate) => (
                  <tr
                    key={candidate.id}
                    className={`border-b border-[#6a6a6a] cursor-pointer ${
                      selectedId === candidate.id ? "bg-[#6a6a6a]" : ""
                    }`}
                    onClick={() => setSelectedId(candidate.id)}
                  >
                    <td className="text-gray-300 p-2">{candidate.rank}</td>
                    <td className="text-gray-300 p-2">{candidate.name}</td>
                    <td className="text-gray-300 p-2">{candidate.score}</td>
                    <td className="text-gray-300 p-2">{candidate.skills}</td>
                    <td className="text-gray-300 p-2">{candidate.gaps}</td>
                    <td className="text-gray-300 p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white text-xs h-6 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/candidate/${candidate.id}`);
                        }}
                      >
                        Open
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </WireframeLayout>
  );
}
