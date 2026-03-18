🧠 Smart Resume Screening & Interview Preparation Assistant

Capstone Project | Kennesaw State University | Group P12

An AI-powered decision-support system designed to improve consistency, transparency, and structure in early-stage candidate evaluation.

This repository contains the full lifecycle of the project across all milestones, including planning, architecture, implementation, testing, and final delivery.

🚀 Project Overview

The Smart Resume Screening & Interview Preparation Assistant is a web-based system that enables recruiters to:

Upload resumes (PDF, DOCX)

Input job descriptions

Perform semantic (embedding-based) candidate evaluation

Rank candidates across:

Skills

Experience

Education

Projects

Generate:

Explainable ranking insights

Tailored interview questions

Unlike traditional systems, this solution uses semantic similarity instead of keyword matching, improving alignment and fairness.

Based on Milestone 1 planning and system design


🧩 Capstone Scope (All Milestones)

This repository tracks the entire capstone progression, not just the final product.

✅ Milestone 1 — Planning & Design (Completed)

Functional and non-functional requirements

UX wireframes and recruiter dashboard design

System architecture and data model

Tech stack selection

GitHub repository setup

Gantt chart creation

🔄 Milestone 2 — Core Development (In Progress)

Resume ingestion and parsing pipeline

Semantic matching (embeddings)

Candidate ranking algorithm

Interview question generation

End-to-end system integration

Mid-semester demonstration

⚙️ Execution Phase (Testing & Refinement)

Bias mitigation testing

Explainability validation

Performance optimization

UI refinement

🎯 Final Phase (Delivery) and Milestone 2

Final documentation

Repository cleanup

Final demonstration and submission

Timeline and task ownership are defined in the Gantt Chart


🏗 System Architecture

The system follows a modular, layered architecture:

Frontend (React): User interaction and recruiter dashboard

Backend (Python API): Processing and orchestration

LLM Layer: Resume parsing, semantic analysis, explanations, and interview generation

Business Logic Layer: Deterministic ranking and scoring

Database (MongoDB): Structured candidate data storage

This design ensures scalability, modularity, and clear separation of concerns.

🧠 Key Features

AI-driven resume parsing into structured JSON

Embedding-based semantic similarity (not keyword matching)

Category-level scoring (skills, experience, education, projects)

Configurable weighted ranking system

Explainable AI outputs

Interview question generation

Recruiter dashboard interface

Modular and scalable architecture

⚙️ Tech Stack

Frontend

React

Backend

Python (API and business logic)

AI / ML

LLaMA 3.1 8B (primary LLM)

Sentence Transformers (semantic embeddings)

Database

MongoDB

Deployment Strategy

Hugging Face API (primary)

Local model fallback (LLaMA 3.2 3B if needed)

📈 Scalability & Design Considerations

Asynchronous processing for handling multiple resumes

Modular components for model replacement

Separation of AI outputs from deterministic ranking logic

Designed for incremental scaling and testing

Initial testing begins with small batches and scales to identify performance thresholds.

⚠️ Assumptions and Constraints

The system is a decision-support tool, not an automated hiring system

No candidates are automatically rejected or filtered out

Protected demographic attributes are not used or inferred

Operates within academic prototype constraints

🔮 Future Enhancements

Expanded evaluation metrics and scoring customization

Improved UI/UX for recruiter workflows

Integration with external HR systems

Advanced bias detection and fairness auditing

Real-time processing optimization

📌 Disclaimer

This system is intended for academic and demonstration purposes. It is not designed to replace human decision-making in hiring processes.
