import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

export function AllScreens() {
  const navigate = useNavigate();

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
            Complete Wireframe Documentation
          </h1>
          <div className="w-32"></div>
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
              <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-3 h-20"></div>
              <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-3 h-24"></div>
              <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-3 h-16"></div>
            </div>
          </div>

          {/* Screen 2 */}
          <div
            className="bg-[#3a3a3a] border-2 border-[#4a4a4a] rounded-lg p-6 cursor-pointer hover:border-[#6a6a6a] transition-all"
            onClick={() => navigate("/processing")}
          >
            <h3 className="text-white font-bold mb-4 text-sm">SCREEN 2: PROCESSING</h3>
            <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-6">
              <div className="text-white text-center mb-4 text-xs">Processing Candidates...</div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="bg-[#5a5a5a] rounded h-6"></div>
                ))}
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
              <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-3 h-8"></div>
              <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-3">
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(28)].map((_, i) => (
                    <div key={i} className="bg-[#5a5a5a] rounded h-4"></div>
                  ))}
                </div>
              </div>
              <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-3 h-20"></div>
            </div>
          </div>

          {/* Screen 4 */}
          <div
            className="bg-[#3a3a3a] border-2 border-[#4a4a4a] rounded-lg p-6 cursor-pointer hover:border-[#6a6a6a] transition-all"
            onClick={() => navigate("/candidate/2")}
          >
            <h3 className="text-white font-bold mb-4 text-sm">
              SCREEN 4: CANDIDATE DETAIL VIEW
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-3 h-16"></div>
                <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-3 h-16"></div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-2 h-20"></div>
                  <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-2 h-20"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-3 h-24"></div>
              </div>
            </div>
          </div>

          {/* Screen 5 */}
          <div
            className="bg-[#3a3a3a] border-2 border-[#4a4a4a] rounded-lg p-6 cursor-pointer hover:border-[#6a6a6a] transition-all lg:col-span-2"
            onClick={() => navigate("/interview/2")}
          >
            <h3 className="text-white font-bold mb-4 text-sm">
              SCREEN 5: INTERVIEW QUESTIONS + ETHICAL FRAMEWORK
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-3 h-16"></div>
                <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-3 h-16"></div>
                <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-3 h-20"></div>
              </div>
              <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
                <div className="text-white text-xs mb-3">ETHICAL & FAIRNESS PANEL</div>
                <div className="space-y-2">
                  <div className="bg-[#5a5a5a] rounded p-2 h-12"></div>
                  <div className="bg-[#5a5a5a] rounded p-2 h-16"></div>
                  <div className="bg-[#5a5a5a] rounded p-2 h-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Documentation Notes */}
        <div className="bg-[#3a3a3a] border-2 border-[#4a4a4a] rounded-lg p-6">
          <h2 className="text-white font-bold mb-4 text-lg">Wireframe Documentation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
            <div>
              <h3 className="font-bold text-white mb-2">Design Principles</h3>
              <ul className="space-y-1 text-xs">
                <li>• Low-fidelity wireframe aesthetic</li>
                <li>• Dark grayscale color palette</li>
                <li>• Clear visual hierarchy</li>
                <li>• Interactive navigation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">Key Features</h3>
              <ul className="space-y-1 text-xs">
                <li>• 5 main application screens</li>
                <li>• Ethical AI framework display</li>
                <li>• Explainable ranking system</li>
                <li>• Human-in-the-loop design</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
