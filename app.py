from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
import requests
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET')
db = SQLAlchemy(app)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text)
    is_bot = db.Column(db.Boolean)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())

@app.route('/')
def index():
    return render_template('chat.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json['message']
    db.session.add(ChatMessage(content=user_input, is_bot=False))

    # First, check if this exact user input has a bot response in the database
    previous = ChatMessage.query.filter_by(content=user_input, is_bot=True).first()
    if previous:
        bot_response = previous.content
    else:
        # If not, call the Gemini API
        headers = {"Content-Type": "application/json"}
        data = {"contents": [{"parts": [{"text": user_input}]}]}
        gemini_response = requests.post(GEMINI_API_URL, headers=headers, json=data)
        try:
            bot_response = gemini_response.json()["candidates"][0]["content"]["parts"][0]["text"]
        except (KeyError, IndexError):
            bot_response = "Sorry, I couldn't process your request."
        # Store the new bot response
        db.session.add(ChatMessage(content=bot_response, is_bot=True))

    db.session.commit()
    return jsonify({'response': bot_response})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
