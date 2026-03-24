import sys
print(sys.executable)

import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

MODEL_NAME = "gemini-2.5-flash"


def build_prompt(name: str, skills: str, experience: str, job_role: str) -> str:
    return f"""
Generate 6 tailored interview questions.

Candidate:
Name: {name}
Skills: {skills}
Experience: {experience}
Role: {job_role}

Requirements:
- Include two technical questions
- Include two behavioral questions
- Include one scenario-based question
- Include one gap in experience question
- Return as a numbered list
- Keep questions concise
"""


def generate_questions(name: str, skills: str, experience: str, job_role: str) -> str:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set.")

    prompt = build_prompt(name, skills, experience, job_role)

    client = genai.Client(api_key=api_key)

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=[
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=prompt)],
            )
        ],
        config=types.GenerateContentConfig(
            tools=[types.Tool(googleSearch=types.GoogleSearch())],
        ),
    )

    text = (response.text or "").strip()
    if not text:
        raise ValueError("Gemini returned an empty response.")

    return text


def infer_experience_from_resume(resume_text: str) -> str:
    lines = [line.strip() for line in resume_text.splitlines() if line.strip()]
    for line in lines:
        lower_line = line.lower()
        if "year" in lower_line or "experience" in lower_line:
            return line
    return "Experience details were extracted from the uploaded resume."


def infer_job_role(job_description: str) -> str:
    lines = [line.strip() for line in job_description.splitlines() if line.strip()]
    return lines[0] if lines else "Target role from the uploaded job description"


def build_candidate_question_inputs(candidate: dict, job_description: str) -> dict:
    strengths = candidate.get("strengths") or []
    gaps = candidate.get("gaps") or []
    resume_text = candidate.get("resume_text", "")

    skills_bits = strengths + [f"Needs validation: {gap}" for gap in gaps]
    skills = ", ".join(skills_bits) if skills_bits else "Skills extracted from the candidate resume"

    return {
        "name": candidate.get("candidate_name", "Candidate"),
        "skills": skills,
        "experience": infer_experience_from_resume(resume_text),
        "job_role": infer_job_role(job_description),
    }
