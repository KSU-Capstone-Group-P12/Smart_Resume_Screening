# Run with: uvicorn main:app --reload

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import docx
import tempfile
import os

from llm_scoring import score_resume_with_llama

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# In-memory storage
# -------------------------

current_job_description = ""
candidate_results = []

# -------------------------
# Root
# -------------------------

@app.get("/")
def root():
    return {"message": "Smart Resume Screening backend is running"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

# -------------------------
# Job Description
# -------------------------

@app.post("/api/jobs/upload")
async def upload_job_description(job_text: str):

    global current_job_description
    current_job_description = job_text

    return {
        "message": "Job description uploaded successfully"
    }

@app.get("/api/jobs/current")
def get_current_job():

    return {
        "job_description": current_job_description
    }

# -------------------------
# Candidate Dashboard
# -------------------------

@app.get("/api/jobs/current/candidates")
def get_candidates():

    return {
        "candidates": candidate_results
    }

# -------------------------
# File Parsing
# -------------------------

def extract_text_from_pdf(file_path: str) -> str:

    text = ""

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

    return text.strip()


def extract_text_from_docx(file_path: str) -> str:

    document = docx.Document(file_path)

    text = "\n".join(
        [p.text for p in document.paragraphs if p.text.strip()]
    )

    return text.strip()

# -------------------------
# Resume Upload
# -------------------------

@app.post("/api/resumes/upload")
async def upload_resume(file: UploadFile = File(...)):

    global current_job_description
    global candidate_results

    if not current_job_description:
        raise HTTPException(
            status_code=400,
            detail="Upload a job description first."
        )

    filename = file.filename.lower()

    if not (filename.endswith(".pdf") or filename.endswith(".docx")):
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported."
        )

    suffix = ".pdf" if filename.endswith(".pdf") else ".docx"

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        contents = await file.read()
        temp_file.write(contents)
        temp_path = temp_file.name

    try:
        if suffix == ".pdf":
            extracted_text = extract_text_from_pdf(temp_path)
        else:
            extracted_text = extract_text_from_docx(temp_path)

        if not extracted_text:
            raise HTTPException(
                status_code=400,
                detail="No readable text found."
            )

        candidate_name = file.filename.replace(".pdf", "").replace(".docx", "")

        llm_result = score_resume_with_llama(
            job_description=current_job_description,
            resume_text=extracted_text
        )

        result = {
            "candidate_name": candidate_name,
            "section_scores": {
                "skills": llm_result["skills_score"],
                "experience": llm_result["experience_score"],
                "education": llm_result["education_score"],
                "projects": llm_result["projects_score"],
                "certifications": llm_result["certifications_score"]
            },
            "final_score": llm_result["final_score"],
            "strengths": llm_result["strengths"],
            "gaps": llm_result["gaps"]
        }

        candidate_results.append(result)

        return {
            "message": "Resume processed successfully",
            "candidate": result
        }

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)