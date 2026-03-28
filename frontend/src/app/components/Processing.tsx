import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { CheckCircle2, Loader2, ArrowLeft, Square } from "lucide-react";
import { WireframeLayout } from "./WireframeLayout";
import { Button } from "./ui/button";

type Step = {
  label: string;
  status: "pending" | "processing" | "complete";
};

const API_BASE = "http://127.0.0.1:8000";

export function Processing() {
  const navigate = useNavigate();
  const location = useLocation();

  const uploadComplete = location.state?.uploadComplete ?? false;
  const uploadedCount = location.state?.uploadedCount ?? 0;

  const [steps, setSteps] = useState<Step[]>([
    { label: "Upload Complete", status: uploadComplete ? "complete" : "pending" },
    { label: "Parsing Resumes", status: "processing" },
    { label: "Scoring Candidates", status: "pending" },
    { label: "Preparing Ranking Results", status: "pending" },
  ]);

  const [statusMessage, setStatusMessage] = useState(
    uploadComplete
      ? `Upload successful. ${uploadedCount} file(s) submitted. Finalizing candidate analysis...`
      : "Preparing candidate analysis..."
  );

  useEffect(() => {
  let cancelled = false;

  const runProcessingCheck = async () => {
    try {
      // Step 1
      setSteps((prev) =>
        prev.map((step, idx) =>
          idx === 1 ? { ...step, status: "processing" } : step
        )
      );

      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Step 2
      setSteps((prev) =>
        prev.map((step, idx) => {
          if (idx === 1) return { ...step, status: "complete" };
          if (idx === 2) return { ...step, status: "processing" };
          return step;
        })
      );

      setStatusMessage("Checking candidate scoring results...");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await fetch(`${API_BASE}/api/jobs/current/candidates`);
      const data = await response.json();

      if (cancelled) return;

      const candidates = data.candidates || [];

      if (candidates.length > 0) {
        setSteps((prev) =>
          prev.map((step, idx) => {
            if (idx === 2) return { ...step, status: "complete" };
            if (idx === 3) return { ...step, status: "processing" };
            return step;
          })
        );

        setStatusMessage("Candidates processed successfully. Preparing dashboard...");

        await new Promise((resolve) => setTimeout(resolve, 1200));

        if (cancelled) return;

        setSteps((prev) => prev.map((step) => ({ ...step, status: "complete" })));
        navigate("/ranking");
      } else {
        setStatusMessage("No candidates found yet. Please try again.");
      }
    } catch (error) {
      console.error("Processing check failed:", error);
      setStatusMessage("Processing failed. Please return and try again.");
    }
  };

  runProcessingCheck();

  return () => {
    cancelled = true;
  };
}, [navigate]);

  return (
    <WireframeLayout title="SCREEN 2: PROCESSING...">
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-gray-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Overview
        </Button>

        <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-8">
          <h2 className="text-white text-xl font-bold mb-8 text-center">
            Processing Candidates...
          </h2>
          <p className="text-center text-gray-400 text-sm mb-6">
            {statusMessage}
          </p>
          <div className="space-y-4 mb-8">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-3">
                {step.status === "complete" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                ) : step.status === "processing" ? (
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0" />
                ) : (
                  <Square className="w-5 h-5 border-2 border-gray-500 rounded flex-shrink-0" />
                )}
                <span
                  className={`text-sm ${
                    step.status === "complete"
                      ? "text-gray-300"
                      : step.status === "processing"
                      ? "text-white font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center text-gray-400 text-xs">
             This may take a few moments depending on resume length and model speed.
          </div>
        </div>
      </div>
    </WireframeLayout>
  );
}