document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const voiceBtn = document.getElementById('voice-btn');
    const loading = document.getElementById('loading');
    const historyList = document.getElementById('history-list');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    let isDarkMode = false;

    // Theme toggle
    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        body.classList.toggle('dark-mode', isDarkMode);
        themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    });

    // Voice recognition
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    voiceBtn.addEventListener('click', () => {
        recognition.start();
        voiceBtn.style.background = '#c0392b';
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        voiceBtn.style.background = '';
        handleSend();
    };

    recognition.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
        voiceBtn.style.background = '';
    };

    recognition.onend = () => {
        voiceBtn.style.background = '';
    };

    // Append message with optional history update
    function appendMessage(text, sender, updateHistory = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = text;
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;

        if (updateHistory && sender === 'user') {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.textContent = text;
            historyItem.addEventListener('click', () => {
                userInput.value = text;
                userInput.focus();
            });
            historyList.appendChild(historyItem);
        }
    }

    async function handleSend() {
        const message = userInput.value.trim();
        if (!message) return;
        appendMessage(message, 'user');
        userInput.value = '';
        loading.style.display = 'block';
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            appendMessage(data.response, 'bot', false);
        } catch (error) {
            console.error('Error:', error);
            appendMessage("Sorry, something went wrong.", 'bot', false);
        } finally {
            loading.style.display = 'none';
        }
    }

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => e.key === 'Enter' && handleSend());
    userInput.focus();
});
