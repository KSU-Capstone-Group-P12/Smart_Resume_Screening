import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ArrowLeft } from "lucide-react";
import { WireframeLayout } from "./WireframeLayout";

const mockData: Record<string, any> = {
  "1": { name: "John Doe", score: "88%" },
  "2": { name: "Sara Khan", score: "87%" },
  "3": { name: "Alex Smith", score: "79%" },
};

export function CandidateDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [notes, setNotes] = useState("");

  const candidate = id ? mockData[id] : mockData["2"];

  return (
    <WireframeLayout title="SCREEN 4: CANDIDATE DETAIL VIEW">
      <div className="space-y-6">
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
              Candidate: {candidate.name}
            </div>
            <div className="bg-[#5a5a5a] border border-[#6a6a6a] px-3 py-1 rounded text-white text-xs">
              Score: {candidate.score}
            </div>
            <div className="bg-[#5a5a5a] border border-[#6a6a6a] px-3 py-1 rounded text-white text-xs">
              Back to Dashboard
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Resume Summary */}
            <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
              <h2 className="text-white font-bold mb-3 text-sm tracking-wide">Resume Summary</h2>
              <div className="space-y-2 text-xs text-gray-300">
                <div className="flex items-start gap-2">
                  <span>•</span>
                  <span>Resume Summary</span>
                </div>
                <div className="flex items-start gap-2">
                  <span>•</span>
                  <span></span>
                </div>
              </div>
            </div>

            {/* Match Breakdown */}
            <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
              <h2 className="text-white font-bold mb-3 text-sm tracking-wide">
                Match Breakdown: ⬆
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#5a5a5a] border border-[#6a6a6a] rounded p-2">
                  <div className="text-gray-400 text-[10px]">High</div>
                  <div className="text-white text-xs">Moderate</div>
                  <div className="text-white text-xs">High</div>
                </div>
                <div className="bg-[#5a5a5a] border border-[#6a6a6a] rounded p-2">
                  <div className="text-gray-400 text-[10px]">High</div>
                </div>
              </div>
            </div>

            {/* Strengths and Skill Gaps */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
                <h3 className="text-white font-bold mb-2 text-sm">Strengths</h3>
                <ul className="space-y-1 text-xs text-gray-300">
                  <li>• Python</li>
                  <li>• Descriptive</li>
                  <li>• Has bullet lines</li>
                  <li>• New pipeline linking</li>
                  <li>• Automation</li>
                </ul>
              </div>
              <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
                <h3 className="text-white font-bold mb-2 text-sm">Skill Gaps</h3>
                <ul className="space-y-1 text-xs text-gray-300">
                  <li>• (Weak)</li>
                  <li>• Exploratory Mean</li>
                  <li>• Enterprises</li>
                  <li>• Modeling Pyhton</li>
                  <li>• LLMproximatelyRecursion ?</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recruiter Notes */}
            <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
              <h2 className="text-white font-bold mb-3 text-sm tracking-wide">Recruiter Notes</h2>
              <div className="bg-[#5a5a5a] border border-[#6a6a6a] rounded p-3 mb-3 min-h-[120px]">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Recruiter Notes"
                  className="bg-transparent border-none text-gray-300 text-xs min-h-[100px] resize-none"
                />
              </div>
              <Button
                variant="outline"
                className="bg-[#5a5a5a] border-[#6a6a6a] text-white text-xs w-full"
              >
                Export Interview Notes
              </Button>
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
