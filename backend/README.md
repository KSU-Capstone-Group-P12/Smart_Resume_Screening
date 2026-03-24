⚙️ Setup & Run Instructions

💡 Backend Setup

1. Open a terminal

Navigate to the backend folder:

cd backend

2. (Optional) Activate your virtual environment:

.venv\Scripts\Activate.ps1

3. Install dependencies:

python -m pip install -r requirements.txt

4. Set your Gemini API key:

$env:GEMINI_API_KEY="your_api_key_here"

5. Ensure Ollama is running and the required model is installed:

ollama list

6. Start the backend server:

uvicorn main:app --reload
