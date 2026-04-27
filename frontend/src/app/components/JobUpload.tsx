import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Upload, FileText, X, ArrowLeft, CheckSquare, Square } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { WireframeLayout } from "./WireframeLayout";
const API_BASE = "http://127.0.0.1:8000";

export function JobUpload() {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const [filters, setFilters] = useState({
    scoreRange: false,
    skills: false,
    skillsFilter: false,
    experienceFilter: false,
  });

const uploadJobDescription = async () => {
  const response = await fetch(
    `${API_BASE}/api/jobs/upload?job_title=${encodeURIComponent(jobTitle)}&job_text=${encodeURIComponent(jobDescription)}`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload the job description.");
  }

  return response.json();
};

// Send selected resume files to the FastAPI backend
const [isSubmitting, setIsSubmitting] = useState(false);
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return;

  const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (fileName: string) => {
  setSelectedFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

const handleStartAnalysis = async () => {
  if (isSubmitting) return;

  if (!jobDescription.trim()) {
    console.error("Job description is required.");
    return;
  }

  if (selectedFiles.length === 0) {
    console.error("No files selected.");
    return;
  }

  try {
    setIsSubmitting(true);

    const jobData = await uploadJobDescription();
    const jobId = jobData.job_id;

    const successfulUploads: string[] = [];

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_id", jobId);

      const response = await fetch(`${API_BASE}/api/resumes/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Resume upload failed for ${file.name}: ${errorText}`);
      }

      const data = await response.json();
      successfulUploads.push(data.candidate?.candidate_name || file.name);
    }

    setUploadedFiles(successfulUploads);
    setSelectedFiles([]);
    navigate("/processing", {
      state: {
        uploadComplete: true,
        uploadedCount: successfulUploads.length,
        jobId: jobId,
      },
    });
  } catch (error) {
    console.error("Start analysis error:", error);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <WireframeLayout title="SCREEN 1: JOB DESCRIPTION + UPLOAD">
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

        {/* Job Description Section */}

        <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
          <h2 className="text-white font-bold mb-3 text-sm tracking-wide">JOB TITLE</h2>
          <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Enter job title here..."
          className="w-full bg-[#5a5a5a] border border-[#6a6a6a] rounded px-3 py-2 text-gray-200 text-xs"
          />
        </div>
        <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
          <h2 className="text-white font-bold mb-3 text-sm tracking-wide">JOB DESCRIPTION</h2>
          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste or type job description here..."
            className="min-h-[120px] bg-[#5a5a5a] border-[#6a6a6a] text-gray-200 font-mono text-xs"
          />
        </div>

        {/* Resume Upload Section */}
        <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
          <h2 className="text-white font-bold mb-3 text-sm tracking-wide">RESUME UPLOAD</h2>
          <div className="border-2 border-dashed border-[#6a6a6a] rounded p-6 text-center mb-4 bg-[#5a5a5a]">
            <input
              type="file"
              id="file-upload"
              multiple
              accept=".pdf,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer block">
              <div className="text-gray-400 text-xs mb-2">Drag & Drop PDF or DOCX Files Here</div>
              <div className="text-gray-500 text-[10px]">- channel file path -</div>
            </label>
          </div>
          <Button   variant="outline"  
            className="bg-[#5a5a5a] border-[#6a6a6a] text-white text-xs"
            onClick={() => document.getElementById("file-upload")?.click()}
            disabled={isSubmitting}
          >
            Upload Button
          </Button>
{selectedFiles.length > 0 && (
  <div className="mt-4 space-y-2">
    {selectedFiles.map((file) => (
      <div
        key={file.name}
        className="flex items-center justify-between bg-[#5a5a5a] border border-[#6a6a6a] rounded px-3 py-2"
      >
        <span className="text-gray-200 text-xs">{file.name}</span>
        <button
          onClick={() => removeFile(file.name)}
          className="text-gray-300 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    ))}
  </div>
)}
        </div>

        {/* Filters Section Commented out for now.
        <div className="bg-[#4a4a4a] border border-[#5a5a5a] rounded p-4">
          <h2 className="text-white font-bold mb-3 text-sm tracking-wide">Filters</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilters({ ...filters, scoreRange: !filters.scoreRange })}
                className="text-gray-300"
              >
                {filters.scoreRange ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </button>
              <span className="text-gray-300 text-xs">Score Range</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilters({ ...filters, skills: !filters.skills })}
                className="text-gray-300"
              >
                {filters.skills ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </button>
              <span className="text-gray-300 text-xs">Skills</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setFilters({ ...filters, skillsFilter: !filters.skillsFilter })
                }
                className="text-gray-300"
              >
                {filters.skillsFilter ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </button>
              <span className="text-gray-300 text-xs">- Skills</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setFilters({ ...filters, experienceFilter: !filters.experienceFilter })
                }
                className="text-gray-300"
              >
                {filters.experienceFilter ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </button>
              <span className="text-gray-300 text-xs">- Experience_1.pdf</span>
            </div>
          </div>
        </div>
        */}
        {/* Start Button */}
        <div className="bg-[#5a5a5a] border border-[#6a6a6a] rounded p-3 text-center">
          <Button
          onClick={handleStartAnalysis}
          disabled={isSubmitting}
          className="bg-[#6a6a6a] hover:bg-[#7a7a7a] text-white border border-[#8a8a8a] w-full disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Start Semantic Analysis"}
          </Button>
        </div>

        {/* Notice */}
        <div className="bg-[#3a3a3a] border border-[#4a4a4a] rounded p-3">
          <p className="text-gray-400 text-[10px] leading-relaxed">
            Notice: This system provides decision support only. No candidates is automatically
            rejected.
          </p>
        </div>
      </div>
    </WireframeLayout>
  );
}
