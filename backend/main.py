# API Routes for fetching and uplading files to db. run with uvicorn main:app --reload
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import docx
import tempfile
import os
from datetime import datetime, timezone
from db import resumes_collection, candidates_collection

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

@app.get("/")
def root():
    return {"message": "Smart Resume Screening backend is running"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

# Return current candidate records for the ranking dashboard still work in progress
@app.get("/api/jobs/current/candidates")
def get_current_candidates():
    candidate_list = list(candidates_collection.find({}, {"_id": 0}))
    return {
        "candidates": candidate_list
    }

@app.get("/api/resumes")
def get_resumes():
    resume_list = list(resumes_collection.find({}, {"_id": 0}))
    return {
        "resumes": resume_list
    }

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
    text = "\n".join([p.text for p in document.paragraphs if p.text.strip()])
    return text.strip()

# Upload a resume file, extract readable text, and store it in MongoDB

@app.post("/api/resumes/upload")
async def upload_resume(file: UploadFile = File(...)):
    filename = file.filename.lower()

    if not (filename.endswith(".pdf") or filename.endswith(".docx")):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")

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
            raise HTTPException(status_code=400, detail="No readable text found in file.")

        resume_doc = {
            "resume_id": file.filename,
            "filename": file.filename,
            "file_type": suffix.replace(".", ""),
            # place holder for now a name field needs to be added to the submission page
            "candidate_name": file.filename.replace(".pdf", "").replace(".docx", ""),
            "raw_text": extracted_text,
            "parse_status": "uploaded",
            "uploaded_at": datetime.now(timezone.utc)
        }

        resumes_collection.insert_one(resume_doc)

        return {
            "message": "Resume uploaded successfully",
            "resume_id": file.filename,
            "filename": file.filename,
            "text_preview": extracted_text[:500]
        }

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)