⚙️ Setup & Run Instructions
💡 Backend Setup
Open a terminal
Navigate to the backend folder:
cd backend
(Optional) Activate your virtual environment:
.venv\Scripts\Activate.ps1
Install dependencies:
python -m pip install -r requirements.txt
Set your Gemini API key:
$env:GEMINI_API_KEY="your_api_key_here"
Ensure Ollama is running and the required model is installed:
ollama list
Start the backend server:
uvicorn main:app --reload
