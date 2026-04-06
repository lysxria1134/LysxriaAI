let userData = JSON.parse(localStorage.getItem('lys_user')) || null;
let chats = JSON.parse(localStorage.getItem('lys_chats')) || [];
let currentChatId = null;
let lastAiMessage = "";

// Başlangıç Kontrolü
window.onload = () => {
    if (userData) {
        document.getElementById('auth-overlay').style.display = 'none';
        updateProfileUI();
        renderHistory();
        startNewChat();
    }
};

// Kayıt Sistemi
function handleRegister() {
    const n = document.getElementById('reg-name').value;
    const m = document.getElementById('reg-mail').value;
    const p = document.getElementById('reg-pass').value;

    if (!n || !m || !p) return alert("Eksik alan!");

    userData = { name: n, mail: m, pass: p };
    localStorage.setItem('lys_user', JSON.stringify(userData));
    
    document.getElementById('auth-overlay').style.display = 'none';
    updateProfileUI();
    renderHistory();
    startNewChat();
}

function updateProfileUI() {
    document.getElementById('p-name').innerText = userData.name;
    document.getElementById('p-mail').innerText = userData.mail;
    document.getElementById('p-pass').innerText = userData.pass;
    document.getElementById('welcomeText').innerText = `Selam ${userData.name}, bugün ne yapalım?`;
}

// Sohbet Yönetimi
function startNewChat() {
    currentChatId = Date.now();
    document.getElementById('chat-window').innerHTML = '';
    document.getElementById('welcome-hero').style.display = 'block';
    toggleSidebar(false);
}

async function sendMessage() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    if (!text) return;

    document.getElementById('welcome-hero').style.display = 'none';
    addBubble('user', text);
    input.value = '';

    try {
        const res = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            body: JSON.stringify({ model: 'llama3', prompt: text, stream: false })
        });
        const data = await res.json();
        lastAiMessage = data.response;
        addBubble('ai', data.response);
        saveChat(text, data.response);
    } catch (e) {
        addBubble('ai', "Ollama bağlantısı başarısız!");
    }
}

function saveChat(userMsg, aiMsg) {
    let activeChat = chats.find(c => c.id === currentChatId);
    if (!activeChat) {
        activeChat = { id: currentChatId, title: userMsg.substring(0, 25), messages: [] };
        chats.unshift(activeChat);
    }
    activeChat.messages.push({ role: 'user', text: userMsg }, { role: 'ai', text: aiMsg });
    localStorage.setItem('lys_chats', JSON.stringify(chats));
    renderHistory();
}

function renderHistory() {
    const cont = document.getElementById('history-container');
    cont.innerHTML = chats.map(c => `
        <div class="chat-item" onclick="loadChat(${c.id})">
            <i class="fa fa-message"></i> ${c.title}
        </div>
    `).join('');
}

function loadChat(id) {
    const chat = chats.find(c => c.id === id);
    if (!chat) return;
    currentChatId = id;
    document.getElementById('welcome-hero').style.display = 'none';
    const win = document.getElementById('chat-window');
    win.innerHTML = '';
    chat.messages.forEach(m => addBubble(m.role, m.text));
    toggleSidebar(false);
}

// Arayüz Kontrolleri
function toggleSidebar(force) {
    const sb = document.getElementById('sidebar');
    sb.classList.toggle('open', force);
}

function toggleProfile() {
    document.getElementById('profile-menu').classList.toggle('active');
}

function logout() {
    localStorage.clear();
    location.reload();
}

// Kopyalama Fonksiyonları
function showToast(txt) {
    const t = document.getElementById('toast');
    t.innerText = txt;
    t.style.display = 'block';
    setTimeout(() => t.style.display = 'none', 2000);
}

function copyLastAIResponse() {
    if (!lastAiMessage) return;
    navigator.clipboard.writeText(lastAiMessage);
    showToast("Mesaj Kopyalandı!");
}

function copySiteLink() {
    navigator.clipboard.writeText(window.location.href);
    showToast("Sitenin linki kopyalandı!");
}

function addBubble(role, text) {
    const win = document.getElementById('chat-window');
    const div = document.createElement('div');
    div.className = `msg ${role}`;
    div.innerText = text;
    win.appendChild(div);
    win.scrollTop = win.scrollHeight;
}

document.getElementById('userInput').addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});
