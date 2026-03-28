import requests
import json
import re

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.1:8b"


def extract_json_from_response(text: str):
    if not text:
        raise ValueError("Empty model response")

    text = text.strip()

    try:
        return json.loads(text)
    except Exception:
        pass

    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        json_str = match.group(0)
        return json.loads(json_str)

    raise ValueError(f"Could not parse JSON from model response: {text}")


def build_scoring_prompt(job_description: str, resume_text: str) -> str:
    return f"""
You are an AI recruitment assistant.

Your job is to compare a candidate resume against a job description.

Score the candidate section by section using the following categories:
- skills_score
- experience_score
- education_score
- projects_score
- certifications_score

Each score must be between 0 and 100.

Then calculate a final_score between 0 and 100 based on the overall fit.

Also provide:
- candidate_name: the candidate's full name from the resume
- summary: a 2-3 sentence recruiter-friendly summary of the candidate
- strengths: a short list of 2-4 strengths
- gaps: a short list of 2-4 missing or weaker areas

Job Description:
\"\"\"
{job_description}
\"\"\"

Resume:
\"\"\"
{resume_text}
\"\"\"

Return ONLY valid JSON.
Do not include markdown.
Do not include explanation outside JSON.

Use exactly this format:

{{
  "candidate_name": "",
  "summary": "",
  "skills_score": 0,
  "experience_score": 0,
  "education_score": 0,
  "projects_score": 0,
  "certifications_score": 0,
  "final_score": 0,
  "strengths": [],
  "gaps": []
}}
"""


def score_resume_with_llama(job_description: str, resume_text: str):
    prompt = build_scoring_prompt(job_description, resume_text)

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.1
            }
        },
        timeout=300
    )

    response.raise_for_status()
    data = response.json()

    raw_output = data.get("response", "")
    parsed = extract_json_from_response(raw_output)

    result = {
        "candidate_name": str(parsed.get("candidate_name", "")).strip(),
        "summary": str(parsed.get("summary", "")).strip(),
        "skills_score": parsed.get("skills_score", 0),
        "experience_score": parsed.get("experience_score", 0),
        "education_score": parsed.get("education_score", 0),
        "projects_score": parsed.get("projects_score", 0),
        "certifications_score": parsed.get("certifications_score", 0),
        "final_score": parsed.get("final_score", 0),
        "strengths": parsed.get("strengths", []),
        "gaps": parsed.get("gaps", [])
    }

    return result
