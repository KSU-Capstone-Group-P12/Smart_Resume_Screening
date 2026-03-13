import { useState } from "react";
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

const mockCandidates: Candidate[] = [
  { id: "1", rank: 1, name: "John Doe", score: "88%", skills: "Python", gaps: "SQL", },
  { id: "2", rank: 2, name: "Sara Khan", score: "82%", skills: "ML", gaps: "Cloud", },
  { id: "3", rank: 3, name: "Alex Smith", score: "79%", skills: "Excel", gaps: "Python", },
  { id: "4", rank: 4, name: "Update", score: "79%", skills: "", gaps: "", },
];

export function CandidateRanking() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>("2");

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
              Data Analyst
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
                  <th className="text-left text-gray-300 p-2 font-normal">Skills</th>
                  <th className="text-left text-gray-300 p-2 font-normal">Skills</th>
                  <th className="text-left text-gray-300 p-2 font-normal">Gaps</th>
                  <th className="text-left text-gray-300 p-2 font-normal">View</th>
                </tr>
              </thead>
              <tbody>
                {mockCandidates.map((candidate) => (
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
                    <td className="text-gray-300 p-2"></td>
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

        {/* Explainable Ranking Panel */}
        {selectedId === "2" && (
          <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
            <h2 className="text-white font-bold mb-4 text-sm tracking-wide">
              Explainable Ranking Panel
            </h2>
            <div className="space-y-3">
              <div className="flex gap-2 text-xs">
                <span className="text-gray-400">Skills Match:</span>
                <span className="text-gray-300">High</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="text-gray-400">Experience Match:</span>
                <span className="text-gray-300">Moderate</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="text-gray-400">Education Match:</span>
                <span className="text-gray-300">High</span>
              </div>
              <div className="border-t border-[#5a5a5a] pt-3 mt-3">
                <p className="text-gray-400 text-[10px] mb-1">Plain Language Explanation:</p>
                <p className="text-gray-300 text-[10px] leading-relaxed">
                  Candidate ranked based on ranked_detailed_analysis. Plain Language Explanation.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </WireframeLayout>
  );
}
