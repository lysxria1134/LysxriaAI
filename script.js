let chats = JSON.parse(localStorage.getItem('lys_chats')) || [];
let currentChatId = null;
let lastAiResponse = "";

window.onload = () => {
    renderHistory();
};

async function sendMessage() {
    const input = document.getElementById('userInput');
    const val = input.value.trim();
    
    // 1. Boş mesaj kontrolü
    if (!val) return;

    // 2. Yeni sohbetse ID oluştur
    if (!currentChatId) currentChatId = Date.now();
    
    // 3. Hoşgeldin yazısını kaldır
    const welcome = document.getElementById('welcome-hero');
    if(welcome) welcome.style.display = 'none';

    // 4. Kullanıcı mesajını ekrana bas ve kutuyu temizle
    addBubble('user', val);
    input.value = '';
    input.style.height = 'auto';

    // 5. AI için boş balon oluştur
    const aiBubble = addBubble('ai', 'Düşünüyor...');
    let fullAiResponse = "";

    try {
        // NGrok linkini buraya KESİN doğru girdiğinden emin ol!
        const response = await fetch('https://lobeliaceous-nonintrospectively-irene.ngrok-free.dev/api/generate', {
            method: 'POST',
            body: JSON.stringify({ 
                model: 'gemma:2b', 
                prompt:  {val},
                stream: true 
            })
        });

        if (!response.ok) throw new Error("Sunucu hatası: " + response.status);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        aiBubble.innerText = ""; // "Düşünüyor..." yazısını sil

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const json = JSON.parse(line);
                    if (json.response) {
                        fullAiResponse += json.response;
                        aiBubble.innerText = fullAiResponse; // Kelime kelime yazdır
                        
                        // Otomatik aşağı kaydır
                        const win = document.getElementById('chat-window');
                        win.scrollTop = win.scrollHeight;
                    }
                } catch (jsonErr) {
                    console.log("Satır işlenemedi, devam ediliyor...");
                }
            }
        }
        
        lastAiResponse = fullAiResponse;
        saveChat(val, fullAiResponse);

    } catch (e) {
        aiBubble.innerText = "Hata: Bağlantı kurulamadı. PowerShell ve Ngrok açık mı?";
        console.error("Detaylı Hata:", e);
    }
}

// Balon ekleme fonksiyonu (Düzeltildi)
function addBubble(role, text) {
    const win = document.getElementById('chat-window');
    const div = document.createElement('div');
    div.className = `msg ${role}`;
    div.innerText = text;
    win.appendChild(div);
    win.scrollTop = win.scrollHeight;
    return div; 
}

// Diğer yardımcı fonksiyonlar aynı kalıyor...
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
    if(!cont) return;
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
    const welcome = document.getElementById('welcome-hero');
    if(welcome) welcome.style.display = 'none';
    const win = document.getElementById('chat-window');
    win.innerHTML = '';
    chat.msgs.forEach(m => addBubble(m.r, m.t));
    toggleSidebar();
}

function startNewChat() {
    currentChatId = null;
    document.getElementById('chat-window').innerHTML = '';
    const welcome = document.getElementById('welcome-hero');
    if(welcome) welcome.style.display = 'block';
    toggleSidebar();
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
