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
        const intro = document.getElementById('intro-text');
        const userText = inp.value.trim();

        if (!userText) return;

        // Mesaj gelince tanıtım yazısını kaldır
        if (intro) intro.style.display = 'none';

        // Kullanıcı mesajını ekrana bas
        win.innerHTML += `<div class="msg user">${userText}</div>`;
        inp.value = '';
        win.scrollTop = win.scrollHeight;

        // AI Yanıt kutusunu oluştur
        const aiMsgDiv = document.createElement('div');
        aiMsgDiv.className = 'msg ai';
        aiMsgDiv.innerText = "...";
        win.appendChild(aiMsgDiv);

        try {
            const response = await fetch(NGROK_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true' // Ngrok uyarı sayfasını atlamak için şart
                },
                body: JSON.stringify({ 
                    model: "tinyllama", // Bilgisayarında yüklü model ismiyle aynı olmalı
                    prompt: userText,
                    stream: false 
                })
            });

            if (!response.ok) {
                throw new Error(`Sunucu hatası: ${response.status}`);
            }

            const data = await response.json();
            // Ollama'dan gelen ana metin 'response' içindedir
            const finalReply = data.response || "Yanıt alınamadı.";
            
            uiManager.typeWriter(aiMsgDiv, finalReply);

        } catch (error) {
            console.error("Detaylı Hata:", error);
            aiMsgDiv.innerText = "Bağlantı kurulamadı. Ngrok linki değişmiş olabilir veya Ollama kapalı.";
            aiMsgDiv.style.color = "#ff4d4d";
        }
    },

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
