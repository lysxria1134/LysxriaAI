let chats = JSON.parse(localStorage.getItem('lys_chats')) || [];
let currentChatId = null;
let lastAiResponse = "";

window.onload = () => {
    renderHistory();
};

async function sendMessage() {
    const input = document.getElementById('userInput');
    const val = input.value.trim();
    if (!val) return;

    if (!currentChatId) currentChatId = Date.now();
    document.getElementById('welcome-hero').style.display = 'none';

    addBubble('user', val);
    input.value = '';
    input.style.height = 'auto';

    try {
        const res = await fetch('https://lobeliaceous-nonintrospectively-irene.ngrok-free.dev/api/generate', {
            method: 'POST',
            body: JSON.stringify({ model: 'tinyllama', prompt: val, stream: false })
        });
        const data = await res.json();
        lastAiResponse = data.response;
        addBubble('ai', data.response);
        saveChat(val, data.response);
    } catch (e) {
        addBubble('ai', "Hata: Eymenin Kurduğu Yapay zeka Şuan mola'da , DİNLENİYOR , Lütfen daha sonra deneyin , Sağlıklı GÜNLER!");
    }
}

function saveChat(u, a) {
    let chat = chats.find(c => c.id === currentChatId);
    if (!chat) {
        chat = { id: currentChatId, title: u.substring(0, 25), msgs: [] };
        chats.unshift(chat);
    }
    chat.msgs.push({ r: 'user', t: u }, { r: 'ai', t: a });
    localStorage.setItem('lys_chats', JSON.stringify(chats));
    renderHistory();
}

function renderHistory() {
    const cont = document.getElementById('history-container');
    cont.innerHTML = chats.map(c => `
        <div class="chat-item" onclick="loadChat(${c.id})">
            <i class="fa fa-message" style="margin-right:10px; color:#b4b4b4"></i> ${c.title}
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
    chat.msgs.forEach(m => addBubble(m.r, m.t));
    toggleSidebar();
}

function startNewChat() {
    currentChatId = null;
    document.getElementById('chat-window').innerHTML = '';
    document.getElementById('welcome-hero').style.display = 'block';
    toggleSidebar();
}

function addBubble(role, text) {
    const win = document.getElementById('chat-window');
    const div = document.createElement('div');
    div.className = `msg ${role}`;
    div.innerText = text;
    win.appendChild(div);
    win.scrollTop = win.scrollHeight;
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }
function toggleProfile() { document.getElementById('profile-menu').classList.toggle('active'); }

function copyLastAIResponse() {
    if (!lastAiResponse) return;
    navigator.clipboard.writeText(lastAiResponse);
    showToast("Mesaj Kopyalandı!");
}

function copySiteLink() {
    navigator.clipboard.writeText(window.location.href);
    showToast("Site linki kopyalandı!");
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg;
    t.style.display = 'block';
    setTimeout(() => t.style.display = 'none', 2000);
}

document.getElementById('userInput').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});
