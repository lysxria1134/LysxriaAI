// --- LYSXRIA AI PRO - GÜNCELLENMİŞ SCRIPT ---

// BURAYI GÜNCELLE: Ngrok terminalindeki "Forwarding" yazan https://... ile başlayan linki buraya yapıştır.
// Not: Linkin sonuna mutlaka /api/generate eklemeyi unutma!
const NGROK_URL = "http://localhost:11434 /api/generate"; 

const uiManager = {
    // Yazma Efekti
    typeWriter: (element, text, speed = 10) => {
        let i = 0;
        element.innerText = "";
        function type() {
            if (i < text.length) {
                element.innerText += text.charAt(i);
                i++;
                setTimeout(type, speed);
                const win = document.getElementById('chat-window');
                if(win) win.scrollTop = win.scrollHeight;
            }
        }
        type();
    },

   sendMessage: async () => {
    const inp = document.getElementById('userInput');
    const win = document.getElementById('chat-window');
    const userText = inp.value.trim();

    if (!userText) return;

    // Arayüz güncellemeleri
    if (document.getElementById('intro-text')) document.getElementById('intro-text').style.display = 'none';
    win.innerHTML += `<div class="msg user">${userText}</div>`;
    inp.value = '';
    
    const aiMsgDiv = document.createElement('div');
    aiMsgDiv.className = 'msg ai';
    aiMsgDiv.innerText = "...";
    win.appendChild(aiMsgDiv);
    win.scrollTop = win.scrollHeight;

    try {
        const response = await fetch(NGROK_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true' 
            },
            body: JSON.stringify({ 
                model: "tinyllama",
                prompt: userText,
                stream: false // BURASI ÇOK ÖNEMLİ: Tek parça yanıt almak için
            })
        });

        if (!response.ok) throw new Error("Ağ yanıtı düzgün değil.");

        const data = await response.json();
        console.log("Ollama'dan gelen ham veri:", data); // F12 konsolunda kontrol et

        // Ollama yanıtı 'response' key'i içinde gönderir
        const finalReply = data.response || "Yanıt içeriği boş.";
        
        uiManager.typeWriter(aiMsgDiv, finalReply);

    } catch (error) {
        console.error("Hata ayrıntısı:", error);
        aiMsgDiv.innerText = "Hata: " + error.message;
        aiMsgDiv.style.color = "#ff4d4d";
    }
}
    setMode: (name, labelText) => {
        const label = document.getElementById('mode-label');
        if(label) {
            label.innerText = labelText || name.toUpperCase();
            label.style.display = 'block';
        }
        if (typeof closeGUI === 'function') closeGUI('model-gui');
    },

    changeLang: (lang) => {
        const isTr = lang === 'tr';
        document.querySelectorAll('[data-tr]').forEach(el => {
            el.innerText = isTr ? el.getAttribute('data-tr') : el.getAttribute('data-en');
        });
        const inp = document.getElementById('userInput');
        if (inp) inp.placeholder = isTr ? 'Mesajınızı buraya bırakın...' : 'Leave your message here...';
        if (typeof closeGUI === 'function') closeGUI('lang-gui');
    },

    rate: (num) => {
        const stars = document.querySelectorAll('.star');
        stars.forEach((s, i) => s.classList.toggle('active', i < num));
    },

    share: (platform) => {
        if(platform === 'whatsapp') window.open('https://wa.me/');
        else alert('Link kopyalandı!');
        if (typeof closeGUI === 'function') closeGUI('share-gui');
    }
};

// Sayfa yüklendiğinde Enter tuşunu aktif et
document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('userInput');
    if (inputField) {
        inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                uiManager.sendMessage();
            }
        });
    }
});
