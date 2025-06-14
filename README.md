# Smart Talk AI

Smart Talk AI is a web-based intelligent chatbot application that leverages the **Google Gemini API** to provide AI-powered responses. It features voice input, dynamic theme switching (light/dark), and persistent chat history stored in a PostgreSQL database. The project is built using **Flask** for the backend and **HTML/CSS/JavaScript** for the frontend.

---

## 🚀 Features

- 🎤 Voice input using the Web Speech API
- 🌗 Light and dark mode toggling
- 💬 Real-time AI responses via Gemini API
- 🗃️ Chat history stored in PostgreSQL
- 🔐 Secure backend with route handling in Flask
- 📱 Responsive UI built with HTML, CSS, and JavaScript

---

## 🛠️ Tech Stack

| Frontend        | Backend | Database   | AI API        |
|-----------------|---------|------------|---------------|
| HTML, CSS, JS   | Flask   | PostgreSQL | Google Gemini |

---





🧪 Setup & Run Locally

Prerequisites:

Python 3.8+
PostgreSQL
Gemini API Key


Installation:
# Clone the repo
git clone https://github.com/RJrohan47/Smart_Talk-AI.git
cd Smart_Talk-AI

# Install dependencies
pip install -r requirements.txt

# Set up PostgreSQL and update connection URI in database.py

# Run the app
python app.py

📜 Environment Variables
GEMINI_API_KEY=your_google_gemini_api_key
DATABASE_URL=postgresql://user:password@localhost:5432/smarttalk
