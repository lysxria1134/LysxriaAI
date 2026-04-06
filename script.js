// --- LYSXRIA AI PRO - HATASIZ SCRIPT ---

const NGROK_URL = "https://lobeliaceous-nonintrospectively-irene.ngrok-free.dev/api/generate"; 

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

    // Mesaj Gönderme
    sendMessage: async () => {
        const inp = document.getElementById('userInput');
        const win = document.getElementById('chat-window');
        const userText = inp.value.trim();

        if (!userText) return;

        // Tanıtım yazısını gizle
        const intro = document.getElementById('intro-text');
        if (intro) intro.style.display = 'none';

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
                    stream: false 
                })
            });

            const data = await response.json();
            const finalReply = data.response || "Yanıt alınamadı.";
            uiManager.typeWriter(aiMsgDiv, finalReply);

        } catch (error) {
            console.error("Hata:", error);
            aiMsgDiv.innerText = "Bağlantı hatası!";
            aiMsgDiv.style.color = "#ff4d4d";
        }
    }, // <-- Virgül burada çok önemli!

    // Mod Ayarlama
    setMode: (name, labelText) => {
        const label = document.getElementById('mode-label');
        if(label) {
            label.innerText = labelText || name.toUpperCase();
            label.style.display = 'block';
        }
        if (typeof closeGUI === 'function') closeGUI('model-gui');
    },

    // Dil Değiştirme
    changeLang: (lang) => {
        const isTr = lang === 'tr';
        document.querySelectorAll('[data-tr]').forEach(el => {
            el.innerText = isTr ? el.getAttribute('data-tr') : el.getAttribute('data-en');
        });
        const input = document.getElementById('userInput');
        if(input) input.placeholder = isTr ? 'Mesajınızı buraya bırakın...' : 'Leave your message here...';
        if (typeof closeGUI === 'function') closeGUI('lang-gui');
    },

    // Puanlama
    rate: (num) => {
        const stars = document.querySelectorAll('.star');
        stars.forEach((s, i) => s.classList.toggle('active', i < num));
    },

    // Paylaşma
    share: (platform) => {
        if(platform === 'whatsapp') window.open('https://wa.me/');
        else alert('Link kopyalandı!');
        if (typeof closeGUI === 'function') closeGUI('share-gui');
    }
};

// Sayfa yüklendiğinde çalışacaklar
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('userInput');
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                uiManager.sendMessage();
            }
        });
    }
});
