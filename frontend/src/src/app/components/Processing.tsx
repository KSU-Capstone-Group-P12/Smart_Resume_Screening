import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { CheckCircle2, Loader2, ArrowLeft, Square } from "lucide-react";
import { WireframeLayout } from "./WireframeLayout";
import { Button } from "./ui/button";

type Step = {
  label: string;
  status: "pending" | "processing" | "complete";
};

export function Processing() {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<Step[]>([
    { label: "Parsing Resumes", status: "pending" },
    { label: "Generating Embeddings", status: "pending" },
    { label: "Computing Similarity Scores", status: "pending" },
    { label: "Generating Ranking Explanations", status: "pending" },
    { label: "Preparing Interview Questions", status: "pending" },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepDuration = 3000; // 3 seconds per step
    const progressInterval = 100; // Update progress every 100ms

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const increment = (100 / stepDuration) * progressInterval;
        const newProgress = prev + increment;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, progressInterval);

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length) {
          setSteps((prevSteps) =>
            prevSteps.map((step, idx) => {
              if (idx < prev) return { ...step, status: "complete" };
              if (idx === prev) return { ...step, status: "processing" };
              return step;
            })
          );
          setProgress(0);
          return prev + 1;
        }
        return prev;
      });
    }, stepDuration);

    const completeTimer = setTimeout(() => {
      setSteps((prevSteps) =>
        prevSteps.map((step) => ({ ...step, status: "complete" }))
      );
      setTimeout(() => {
        navigate("/ranking");
      }, 1000);
    }, stepDuration * steps.length);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
      clearTimeout(completeTimer);
    };
  }, [navigate, steps.length]);

  const completedSteps = steps.filter((s) => s.status === "complete").length;
  const overallProgress = (completedSteps / steps.length) * 100;

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
            Estimated Time: &lt; 30 seconds
          </div>
        </div>
      </div>
    </WireframeLayout>
  );
}