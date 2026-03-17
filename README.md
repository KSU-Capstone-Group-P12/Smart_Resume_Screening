🧠 AI-Powered Resume Screening & Ranking System

An intelligent resume analysis and candidate ranking platform that leverages Large Language Models (LLMs) for structured parsing, semantic comparison, scoring, explainable candidate evaluation, and generating interview questions.

This system is designed to demonstrate modern AI system architecture, scalable processing, and clean separation between AI intelligence and deterministic business logic.

🚀 Project Overview

This application allows recruiters to:

Upload resumes (PDF, DOCX, JSON)

Input job descriptions

Automatically parse resumes into structured JSON

Perform semantic comparison between resumes and job requirements

Generate category-level scores

Apply weighted ranking rules

Receive explainable candidate evaluations

Generate tailored interview questions

View ranked candidates in a dynamic dashboard

The system is architected to support scalable processing and clean modular design.

🏗 System Architecture

The system follows a layered architecture:

1️⃣ Presentation Layer (React UI)

Resume upload interface

Job description input

Ranked candidate dashboard

AI-generated explanations and interview questions

2️⃣ API / Application Layer

Request handling

Authentication & authorization

Input validation

Routing to backend services

3️⃣ Resume Ingestion Module

PDF upload handling

Text extraction

Text preprocessing and normalization

4️⃣ LLM Processing Engine

Structured resume parsing (JSON output)

Semantic comparison with job description

Category-level scoring

Plain-language explanation generation

Interview question generation

5️⃣ Business Logic Layer

Weighted score calculation

Deterministic final ranking

Configuration management (adjustable scoring weights)

6️⃣ Data Access Layer

Database abstraction

Query handling

Validation enforcement

7️⃣ Database Layer (MongoDB)

Structured resume JSON

Category scores

Final rankings

Explanations

Interview questions

System configuration settings

⚙️ Scalability Design

The system supports scalable processing through:

Asynchronous request handling

Message queue integration (for load control)

Worker-based LLM processing

Horizontal scaling capability

Configurable load testing approach

Initial testing begins with 20 resumes and scales incrementally to determine performance thresholds and identify bottlenecks.

🧠 Architectural Philosophy

This system enforces strict separation of concerns:

LLM Layer → Generates intelligence (parsing, semantic analysis, explanations)

Business Logic Layer → Applies deterministic rules (weighted ranking, sorting)

Data Layer → Handles persistence

UI Layer → Handles interaction only

This ensures:

Auditability

Reproducibility

Configurability

Model replaceability

Enterprise-ready structure

📊 Key Features

AI-driven structured resume parsing

Semantic similarity analysis

Configurable weighted ranking

Deterministic scoring governance

Explainable AI outputs

Interview question generation

Modular, scalable architecture

MongoDB document-based storage

Load testing and scaling strategy

🛠 Tech Stack

Frontend:

React
*Original project design created via Figma. 

Backend:

Python (API & business logic)

LLM integration

Resume parsing utilities

Database:

MongoDB

Processing:

LLM-based semantic modeling

Optional message queue for scalable processing

📈 Future Enhancements

TBD

🎯 Why This Project?

This project demonstrates:

End-to-end AI system design

Scalable architecture planning

Clean separation of AI and business logic

Deterministic governance over probabilistic models

Production-oriented thinking

It reflects real-world considerations for deploying AI systems responsibly in hiring workflows.

📌 Disclaimer

This system is designed as a technical demonstration of AI-assisted screening. It is not intended to fully replace human hiring decisions.
