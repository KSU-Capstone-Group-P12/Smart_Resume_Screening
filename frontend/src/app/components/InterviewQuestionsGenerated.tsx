import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { WireframeLayout } from "./WireframeLayout";
import { Button } from "./ui/button";

const API_BASE = "http://127.0.0.1:8000";

type Candidate = {
  id: string;
  candidate_name: string;
  strengths: string[];
  gaps: string[];
};

export function InterviewQuestionsGenerated() {
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
  const loadSavedInterviewQuestions = async () => {
    if (!id) return false;
    try {
      const response = await fetch(`${API_BASE}/api/candidates/${id}/interview-questions`);
      const data = await response.json();
      
      if (!response.ok) {
      return false;
    }

    const raw = data.raw_questions || "";
    setRawQuestions(raw);
    setQuestions(Array.isArray(data.questions) ? data.questions : parseQuestions(raw));
    return true;
  } catch {
    return false;
  }
};

useEffect(() => {
  const init = async () => {
    if (!id) return;
    const found = await loadSavedInterviewQuestions();
    if (!found) {
      await generateInterviewQuestions();
    }
  };

  init();
}, [id]);

  return (
    <WireframeLayout title="SCREEN 5: INTERVIEW QUESTIONS">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/candidate/${id}`)}
            className="text-gray-300 hover:text-white text-xs"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="bg-[#5a5a5a] border border-[#6a6a6a] px-3 py-2 rounded text-white text-xs">
            Candidate: {candidate?.candidate_name || `#${id}`}
          </div>
        </div>

        <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-white font-bold text-sm tracking-wide">
                AI-Generated Interview Questions
              </h2>
              <p className="text-gray-400 text-xs mt-1">
                Questions are tailored from the candidate resume, strengths, gaps, and current job description.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={generateInterviewQuestions}
              disabled={loading}
              className="bg-[#5a5a5a] border-[#6a6a6a] text-white text-xs"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </span>
              ) : (
                "Regenerate Questions"
              )}
            </Button>
          </div>

          {error && (
            <div className="bg-[#5a3a3a] border border-[#7a4a4a] rounded p-3 text-red-200 text-xs">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#5a5a5a] border border-[#6a6a6a] rounded p-4">
              <h3 className="text-white font-bold mb-3 text-xs tracking-wide">
                Candidate Strengths
              </h3>
              <div className="space-y-2 text-xs text-gray-300">
                {(candidate?.strengths || []).length > 0 ? (
                  candidate?.strengths.map((strength, idx) => (
                    <div key={idx} className="bg-[#666666] rounded px-3 py-2">
                      {strength}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">Strengths will appear after resume scoring.</div>
                )}
              </div>
            </div>

            <div className="bg-[#5a5a5a] border border-[#6a6a6a] rounded p-4">
              <h3 className="text-white font-bold mb-3 text-xs tracking-wide">
                Areas To Probe
              </h3>
              <div className="space-y-2 text-xs text-gray-300">
                {(candidate?.gaps || []).length > 0 ? (
                  candidate?.gaps.map((gap, idx) => (
                    <div key={idx} className="bg-[#666666] rounded px-3 py-2">
                      {gap}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">Gap analysis will appear after resume scoring.</div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {questions.length > 0 ? (
              questions.map((question, idx) => (
                <div
                  key={idx}
                  className="bg-[#5a5a5a] border border-[#6a6a6a] rounded p-3 text-gray-200 text-sm"
                >
                  {question}
                </div>
              ))
            ) : (
              <div className="bg-[#5a5a5a] border border-[#6a6a6a] rounded p-4 text-gray-400 text-xs">
                {loading ? "Generating questions for this candidate..." : "No questions generated yet."}
              </div>
            )}
          </div>

          {rawQuestions && questions.length === 0 && (
            <div className="bg-[#5a5a5a] border border-[#6a6a6a] rounded p-4">
              <h3 className="text-white font-bold mb-2 text-xs tracking-wide">Raw Model Output</h3>
              <pre className="whitespace-pre-wrap text-xs text-gray-300">{rawQuestions}</pre>
            </div>
          )}

          <div className="bg-[#3a3a3a] border border-[#4a4a4a] rounded p-3 text-[11px] text-gray-300 leading-relaxed">
            Human review remains required. These questions are decision-support prompts designed to validate skills, explore behavior, and clarify resume gaps without using demographic data.
          </div>
        </div>
      </div>
    </WireframeLayout>
  );
}
