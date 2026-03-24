import { useNavigate } from "react-router";
import { FileText, Loader2, BarChart3, User, MessageSquare, Layout } from "lucide-react";

export function WireframeOverview() {
  const navigate = useNavigate();

  const screens = [
    {
      title: "Screen 1: Job Description + Upload",
      path: "/job-upload",
      icon: FileText,
      description: "Upload job description and candidate resumes",
    },
    {
      title: "Screen 2: Processing",
      path: "/processing",
      icon: Loader2,
      description: "View semantic analysis in progress",
    },
    {
      title: "Screen 3: Candidate Ranking Dashboard",
      path: "/ranking",
      icon: BarChart3,
      description: "Review ranked candidates with explanations",
    },
    {
      title: "Screen 4: Candidate Detail View",
      path: "/candidate/2",
      icon: User,
      description: "Deep dive into individual candidate profiles",
    },
    {
      title: "Screen 5: Interview Questions",
      path: "/interview/2",
      icon: MessageSquare,
      description: "AI-generated interview questions and ethical framework",
    },
    {
      title: "View All Screens",
      path: "/all-screens",
      icon: Layout,
      description: "See complete wireframe documentation",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#3a3a3a] p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-6 py-12">
          <div className="inline-block bg-[#4a4a4a] border-2 border-[#5a5a5a] rounded-lg px-6 py-3">
            <h1 className="text-5xl font-bold text-white tracking-wider">
              SMART RESUME SCREENING SYSTEM
            </h1>
          </div>
          <p className="text-2xl text-gray-400 tracking-wide">
            Milestone 2: AI-Driven Application Development
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-500">
            <span>Human-in-the-Loop AI</span>
            <span>•</span>
            <span>Explainable Rankings</span>
            <span>•</span>
            <span>Fairness-Aware Design</span>
          </div>
        </div>

        {/* Navigation Grid */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-6 text-center">
            Select a Screen to View
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {screens.map((screen) => {
              const Icon = screen.icon;
              return (
                <button
                  key={screen.path}
                  onClick={() => navigate(screen.path)}
                  className="group bg-[#3a3a3a] hover:bg-[#4a4a4a] border-2 border-[#4a4a4a] hover:border-[#6a6a6a] rounded-lg p-8 text-left transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-[#5a5a5a] group-hover:bg-[#6a6a6a] p-3 rounded-lg transition-colors">
                      <Icon className="w-6 h-6 text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg mb-2 group-hover:text-blue-300 transition-colors">
                        {screen.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {screen.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    View Wireframe →
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Features Grid */}
        <div className="bg-[#3a3a3a] border-2 border-[#4a4a4a] rounded-lg p-8">
          <h2 className="text-white font-bold text-2xl mb-6 text-center">System Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded-lg p-6">
              <h3 className="text-white font-bold mb-4">AI-Powered Analysis</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Semantic similarity scoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Vector embeddings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Category-level matching</span>
                </li>
              </ul>
            </div>
            <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded-lg p-6">
              <h3 className="text-white font-bold mb-4">Ethical Design</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Human-in-the-Loop oversight</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>No automatic rejection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Fairness-aware UI</span>
                </li>
              </ul>
            </div>
            <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded-lg p-6">
              <h3 className="text-white font-bold mb-4">Transparency</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Explainable rankings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Plain language explanations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Skill gap identification</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm border-t border-[#4a4a4a] pt-8 [&>p:first-child]:hidden">
          <p>Professional UX Wireframe Sketch • Milestone 1 Deliverable</p>
          <p>AI Resume Screening and Interview Assistant • Milestone 2 Deliverable</p>
          <p className="mt-2">Click any screen above to view the interactive wireframe</p>
        </div>
      </div>
    </div>
  );
}
