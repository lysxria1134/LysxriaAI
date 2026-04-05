let currentLang = 'tr';
let rating = 0;

// GUI Kontrolleri
function toggleGUI(id) {
    const gui = document.getElementById(id);
    gui.style.display = (gui.style.display === 'block') ? 'none' : 'block';
}

function setLang(lang) {
    currentLang = lang;
    alert(lang === 'tr' ? "Dil Türkçe yapıldı!" : "Language set to English!");
    toggleGUI('lang-gui');
}

function rate(n) {
    rating = n;
    const stars = document.getElementById('stars').getElementsByTagName('i');
    for(let i=0; i<5; i++) {
        stars[i].classList.toggle('active', i < n);
    }
}

function submitRate() {
    const text = document.getElementById('rate-text').value;
    alert("Değerlendirmen alındı: " + rating + " Yıldız. Teşekkürler!");
    toggleGUI('rate-gui');
}

// Mesajlaşma Sistemi (Maksimum Hız)
async function sendMessage() {
    const input = document.getElementById('userInput');
    const val = input.value.trim();
    if (!val) return;

    addBubble('user', val);
    input.value = '';
    const aiBubble = addBubble('ai', '...');
    let fullText = "";

    try {
        const response = await fetch('https://lobeliaceous-nonintrospectively-irene.ngrok-free.dev/api/generate', {
            method: 'POST',
            body: JSON.stringify({
                model: 'tinyllama',
                prompt: `System: Respond in ${currentLang === 'tr' ? 'Turkish' : 'English'}. Be fast.\nUser: ${val}\nAssistant:`,
                stream: true
            })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        aiBubble.innerText = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            for (const line of lines) {
                if (!line) continue;
                const data = JSON.parse(line);
                if (data.response) {
                    fullText += data.response;
                    aiBubble.innerText = fullText;
                    const win = document.getElementById('chat-window');
                    win.scrollTop = win.scrollHeight;
                }
            }
        }
    } catch (e) {
        aiBubble.innerText = "Hata: Sunucuya bağlanılamadı.";
    }
}

function addBubble(role, text) {
    const win = document.getElementById('chat-window');
    const div = document.createElement('div');
    div.className = `msg ${role}`;
    div.innerText = text;
    win.appendChild(div);
    win.scrollTop = win.scrollHeight;
    return div;
}