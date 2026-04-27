# Run with: uvicorn main:app --reload
from db import resumes_collection, candidates_collection, interview_questions_collection, jobs_collection
from datetime import datetime, timezone
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
import pdfplumber
import docx
import tempfile
import os

from llm_scoring import score_resume_with_llama
from interview_questions import build_candidate_question_inputs, generate_questions

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

current_job_title = ""
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
async def upload_job_description(job_title: str = "", job_text: str = ""):
    global current_job_title
    global current_job_description
    global candidate_results

    if not job_text or not job_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description cannot be empty."
        )

    current_job_title = job_title.strip() if job_title else "Untitled Role"
    current_job_description = job_text.strip()
    candidate_results = []

    existing_job = jobs_collection.find_one({
        "title": current_job_title,
        "description": current_job_description,
        })
    if existing_job:
        job_id = str(existing_job["_id"])
    else:
        job_doc = {
            "title": current_job_title,
            "description": current_job_description,
            "created_at": datetime.now(timezone.utc),
            }
        job_insert = jobs_collection.insert_one(job_doc)
        job_id = str(job_insert.inserted_id)
    return {
        "job_id": job_id,
        "job_title": current_job_title,
        "job_description": current_job_description
    }

@app.get("/api/jobs/current")
def get_current_job():
    return {
        "job_title": current_job_title,
        "job_description": current_job_description
    }

@app.get("/api/jobs")
def get_jobs():
    job_docs = list(
        jobs_collection.find(
            {},
            {
                "_id": 1,
                "title": 1,
                "description": 1,
                "created_at": 1,
            }
        ).sort("created_at", -1)
    )

    jobs = []
    for job in job_docs:
        jobs.append({
            "id": str(job["_id"]),
            "title": job.get("title", "Untitled Role"),
            "description": job.get("description", ""),
        })

    return {"jobs": jobs}

@app.get("/api/jobs/{job_id}/candidates")
def get_candidates_for_job(job_id: str):
    candidate_docs = list(
        candidates_collection.find(
            {"job_id": job_id},
            {
                "_id": 1,
                "candidate_name": 1,
                "final_score": 1,
                "strengths": 1,
                "gaps": 1,
                "processed_at": 1,
            }
        )
    )

    sorted_candidates = sorted(
        candidate_docs,
        key=lambda candidate: candidate.get("final_score", 0),
        reverse=True
    )

    formatted_candidates = []
    for index, candidate in enumerate(sorted_candidates, start=1):
        strengths = candidate.get("strengths", [])
        gaps = candidate.get("gaps", [])

        formatted_candidates.append({
            "id": str(candidate["_id"]),
            "rank": index,
            "name": candidate.get("candidate_name", f"Candidate {index}"),
            "score": f'{candidate.get("final_score", 0)}%',
            "skills": ", ".join(strengths[:3]),
            "gaps": ", ".join(gaps[:3]),
        })

    return {"candidates": formatted_candidates}

# --------------------------
# Candidate Dashboard
# -------------------------

@app.get("/api/jobs/current/candidates")
def get_candidates():
    candidate_docs = list(
        candidates_collection.find(
            {},
            {
                "_id": 0,
                "candidate_name": 1,
                "final_score": 1,
                "strengths": 1,
                "gaps": 1,
                "processed_at": 1,
            }
        )
    )

    sorted_candidates = sorted(
        candidate_docs,
        key=lambda candidate: candidate.get("final_score", 0),
        reverse=True
    )


    formatted_candidates = []

    for index, candidate in enumerate(sorted_candidates, start=1):
        strengths = candidate.get("strengths", [])
        gaps = candidate.get("gaps", [])

        formatted_candidates.append({
            "id": str(index),
            "rank": index,
            "name": candidate.get("candidate_name", f"Candidate {index}"),
            "score": f'{candidate.get("final_score", 0)}%',
            "skills": ", ".join(strengths[:3]),
            "gaps": ", ".join(gaps[:3]),
        })

    return {
        "job_title": current_job_title,
        "candidates": formatted_candidates
    }


@app.get("/api/candidates/{candidate_id}")
def get_candidate(candidate_id: str):
    try:
        candidate = candidates_collection.find_one(
            {"_id": ObjectId(candidate_id)},
            {
                "_id": 1,
                "candidate_name": 1,
                "summary": 1,
                "final_score": 1,
                "strengths": 1,
                "gaps": 1,
                "resume_text": 1,
                "section_scores": 1,
                "job_description": 1,
                "job_id": 1,
                "recruiter_notes": 1,
                "processed_at": 1,
            }
        )
    except Exception as exc:
        raise HTTPException(status_code=404, detail="Candidate not found.") from exc

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found.")

    return {
        "candidate": {
            "id": str(candidate["_id"]),
            "candidate_name": candidate.get("candidate_name", "Candidate"),
            "summary": candidate.get("summary", ""),
            "score": f'{candidate.get("final_score", 0)}%',
            "strengths": candidate.get("strengths", []),
            "gaps": candidate.get("gaps", []),
            "resume_text": candidate.get("resume_text", ""),
            "section_scores": candidate.get("section_scores", {}),
            "job_description": candidate.get("job_description", ""),
            "recruiter_notes": candidate.get("recruiter_notes", ""),
            "job_id": candidate.get("job_id", ""),
        }
    }

@app.put("/api/candidates/{candidate_id}/notes")
def update_candidate_notes(candidate_id: str, payload: dict):
    notes = (payload.get("recruiter_notes") or "").strip()

    try:
        result = candidates_collection.update_one(
            {"_id": ObjectId(candidate_id)},
            {"$set": {"recruiter_notes": notes}}
        )
    except Exception as exc:
        raise HTTPException(status_code=404, detail="Candidate not found.") from exc

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Candidate not found.")

    return {
        "message": "Recruiter notes saved successfully.",
        "recruiter_notes": notes
    }

@app.post("/api/candidates/{candidate_id}/interview-questions")
def create_interview_questions(candidate_id: str):
    try:
        candidate = candidates_collection.find_one(
            {"_id": ObjectId(candidate_id)},
            {
                "_id": 1,
                "candidate_name": 1,
                "strengths": 1,
                "gaps": 1,
                "resume_text": 1,
                "job_description": 1,
                "job_id": 1,
                "final_score": 1,
            }
        )
    except Exception as exc:
        raise HTTPException(status_code=404, detail="Candidate not found.") from exc

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found.")

    job_description_for_questions = candidate.get("job_description", "") or current_job_description
    if not job_description_for_questions:
        raise HTTPException(status_code=400, detail="No job description available for this candidate.")

    try:
        prompt_inputs = build_candidate_question_inputs(candidate, job_description_for_questions)
        questions = generate_questions(**prompt_inputs)

        parsed_questions = [
            line.strip()
            for line in questions.splitlines()
            if line.strip()
        ]

        interview_doc = {
            "candidate_id": candidate_id,
            "candidate_name": candidate.get("candidate_name", "Candidate"),
            "job_title": current_job_title,
            "job_description": job_description_for_questions,
            "questions": parsed_questions,
            "raw_questions": questions,
            "generated_at": datetime.now(timezone.utc),
        }

        interview_questions_collection.update_one(
            {"candidate_id": candidate_id},
            {"$set": interview_doc},
            upsert=True
        )

    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Failed to generate interview questions."
        ) from exc

    return {
        "candidate_id": candidate_id,
        "candidate_name": candidate.get("candidate_name", "Candidate"),
        "questions": questions,
    }

@app.get("/api/candidates/{candidate_id}/interview-questions")
def get_saved_interview_questions(candidate_id: str):
    doc = interview_questions_collection.find_one(
        {"candidate_id": candidate_id},
        {"_id": 0}
    )

    if not doc:
        raise HTTPException(status_code=404, detail="No saved interview questions found.")

    return doc

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
async def upload_resume(
    file: UploadFile = File(...),
    job_id: str = Form(...)
):

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
        
        fallback_name = file.filename.replace(".pdf", "").replace(".docx", "")
        
        resume_doc = {
            "candidate_name_raw": fallback_name,
            "filename": file.filename,
            "file_type": suffix.replace(".", ""),
            "job_id": job_id,
            "job_description": current_job_description,
            "raw_text": extracted_text,
            "parse_status": "uploaded",
            "uploaded_at": datetime.now(timezone.utc),
        }

        resume_insert = resumes_collection.insert_one(resume_doc)

        llm_result = score_resume_with_llama(
            job_description=current_job_description,
            resume_text=extracted_text
        )
        
        candidate_name = (llm_result.get("candidate_name") or "").strip() or fallback_name

        resumes_collection.update_one(
             {"_id": resume_insert.inserted_id},
             {
                 "$set": {
                     "candidate_name_extracted": candidate_name,
                     "parse_status": "processed"
                }
            }
        )

        result = {
            "candidate_name": candidate_name,
            "summary": llm_result.get("summary", ""),
            "resume_text": extracted_text,
            "job_description": current_job_description,
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

        candidate_doc = {
            "resume_id": str(resume_insert.inserted_id),
            "job_id": job_id,
            "candidate_name": result["candidate_name"],
            "summary": result["summary"],
            "resume_text": result["resume_text"],
            "job_description": result["job_description"],
            "section_scores": result["section_scores"],
            "final_score": result["final_score"],
            "strengths": result["strengths"],
            "gaps": result["gaps"],
            "interview_questions": [],
            "recruiter_notes": "",
            "processed_at": datetime.now(timezone.utc),
        }

        candidates_collection.insert_one(candidate_doc)

        candidate_results.append(result)

        return {
            "message": "Resume processed successfully",
            "candidate": result
        }

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
