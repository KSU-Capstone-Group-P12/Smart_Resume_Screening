import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "./ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { WireframeLayout } from "./WireframeLayout";

const API_BASE = "http://127.0.0.1:8000";

type Candidate = {
  id: string;
  candidate_name: string;
  strengths: string[];
  gaps: string[];
};

export function InterviewQuestions() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [rawQuestions, setRawQuestions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const parseQuestions = (text: string) =>
    text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => /^\d+[\.\)]\s+/.test(line));

  const loadCandidate = async () => {
    if (!id) return;

    try {
      const response = await fetch(`${API_BASE}/api/candidates/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to load candidate details.");
      }

      setCandidate(data.candidate);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load candidate details.");
    }
  };

  const generateInterviewQuestions = async () => {
    if (!id) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/candidates/${id}/interview-questions`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to generate interview questions.");
      }

      setRawQuestions(data.questions);
      setQuestions(parseQuestions(data.questions));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate interview questions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidate();
  }, [id]);

  useEffect(() => {
    if (id) {
      generateInterviewQuestions();
    }
  }, [id]);

  return (
    <WireframeLayout title="SCREEN 5: INTERVIEW QUESTIONS">
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-gray-300 hover:text-white text-xs"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Overview
        </Button>

        {/* Skill Validation Questions */}
        <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
          <h2 className="text-white font-bold mb-3 text-sm tracking-wide">
            Skill Validation Questions
          </h2>
          <div className="h-16 bg-[#5a5a5a] border border-[#6a6a6a] rounded"></div>
        </div>

        {/* Gap Clarification Questions */}
        <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
          <h2 className="text-white font-bold mb-3 text-sm tracking-wide">
            Gap Clarification Questions
          </h2>
          <div className="h-16 bg-[#5a5a5a] border border-[#6a6a6a] rounded"></div>
        </div>

        {/* Skill Validation Questions with Examples */}
        <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
          <h2 className="text-white font-bold mb-3 text-sm tracking-wide">
            Skill Validation Questions
          </h2>
          <div className="space-y-3">
            {questions.map((question, idx) => (
              <div
                key={idx}
                className="bg-[#5a5a5a] border border-[#6a6a6a] rounded p-3 text-gray-300 text-xs"
              >
                {question}
              </div>
            ))}
          </div>
        </div>

        {/* Regenerate Button */}
        <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4 text-center">
          <Button
            variant="outline"
            className="bg-[#5a5a5a] border-[#6a6a6a] text-white text-xs"
          >
            Regenerate Questions
          </Button>
        </div>

        {/* Ethical & Fairness Panel */}
        <div className="mt-8">
          <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
            <h2 className="text-white font-bold mb-4 text-sm tracking-wide">
              ETHICAL & FAIRNESS UX ELEMENTS
            </h2>

            <div className="space-y-4">
              {/* Transparency */}
              <div className="bg-[#5a5a5a] border border-[#6a6a6a] rounded p-3">
                <h3 className="text-white font-bold mb-2 text-xs">TRANSPARENCY</h3>
                <div className="h-12 bg-[#6a6a6a] rounded"></div>
              </div>

              {/* Checkmarks */}
              <div className="bg-[#5a5a5a] border border-[#6a6a6a] rounded p-3 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-red-400">✗</span>
                  <span className="text-gray-300">No Color-Coded Rejection</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-red-400">✗</span>
                  <span className="text-gray-300">Explainable AI</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">No Demographic Data Displayed</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">Human-in-Lo/Looop</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-green-400">✓</span>
                  <span className="text-gray-300">Fairness-Aware UI</span>
                </div>
              </div>

              {/* Architectural Mapping */}
              <div className="bg-[#5a5a5a] border border-[#6a6a6a] rounded p-3">
                <h3 className="text-white font-bold mb-3 text-xs">ARCHITECTURAL MAPPING</h3>
                <div className="bg-[#6a6a6a] rounded p-3 text-[10px] text-gray-400">
                  <div className="mb-2">Backend Components</div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-[#5a5a5a] border border-[#4a4a4a] rounded p-2 text-center">
                      Resume Ingestion
                    </div>
                    <div className="bg-[#5a5a5a] border border-[#4a4a4a] rounded p-2 text-center">
                      [ Embedder + Model ]
                    </div>
                    <div className="bg-[#5a5a5a] border border-[#4a4a4a] rounded p-2 text-center">
                      Ranking
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-[#5a5a5a] border border-[#4a4a4a] rounded p-2 text-center">
                      LLM
                    </div>
                    <div className="bg-[#5a5a5a] border border-[#4a4a4a] rounded p-2 text-center">
                      + UI
                    </div>
                    <div className="bg-[#5a5a5a] border border-[#4a4a4a] rounded p-2 text-center">
                      Embeddings
                    </div>
                    <div className="bg-[#5a5a5a] border border-[#4a4a4a] rounded p-2 text-center">
                      Ranking
                    </div>
                    <div className="bg-[#5a5a5a] border border-[#4a4a4a] rounded p-2 text-center col-span-2">
                      LLM (Question/Exp)
                    </div>
                    <div className="bg-[#5a5a5a] border border-[#4a4a4a] rounded p-2 text-center col-span-2">
                      HumanFeedback
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WireframeLayout>
  );
}
