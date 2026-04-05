// --- LYSXRIA AI PRO - KESİN ÇALIŞAN SCRIPT ---

const NGROK_URL = "https://lobeliaceous-nonintrospectively-irene.ngrok-free.dev/api/generate"; 

const uiManager = {
    // ChatGPT Yazma Efekti
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

        if (intro) intro.style.display = 'none';

        // Kullanıcı mesajı
        win.innerHTML += `<div class="msg user">${userText}</div>`;
        inp.value = '';
        win.scrollTop = win.scrollHeight;

        // AI Düşünüyor kutusu
        const aiMsgDiv = document.createElement('div');
        aiMsgDiv.className = 'msg ai';
        aiMsgDiv.innerText = "...";
        win.appendChild(aiMsgDiv);

        try {
            // HATA BURADAYDI: fetch komutu eklenmemişti
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

            if (!response.ok) throw new Error("Sunucu hatası");

            const data = await response.json();
            const finalReply = data.response || data.reply || "Cevap boş döndü.";
            
            uiManager.typeWriter(aiMsgDiv, finalReply);

        } catch (error) {
            console.error("Hata:", error);
            aiMsgDiv.innerText = "Bağlantı hatası! Lütfen Ngrok'un açık olduğundan ve URL'nin doğru olduğundan emin ol.";
            aiMsgDiv.style.color = "#ff4d4d";
        }
    },

    setMode: (name, labelText) => {
        const label = document.getElementById('mode-label');
        if(label) {
            label.innerText = labelText || name.toUpperCase();
            label.style.display = 'block';
        }
        closeGUI('model-gui');
    },

    changeLang: (lang) => {
        const isTr = lang === 'tr';
        document.querySelectorAll('[data-tr]').forEach(el => {
            el.innerText = isTr ? el.getAttribute('data-tr') : el.getAttribute('data-en');
        });
        document.getElementById('userInput').placeholder = isTr ? 'Mesajınızı buraya bırakın...' : 'Leave your message here...';
        closeGUI('lang-gui');
    },

    rate: (num) => {
        const stars = document.querySelectorAll('.star');
        stars.forEach((s, i) => s.classList.toggle('active', i < num));
    },

    share: (platform) => {
        if(platform === 'whatsapp') window.open('https://wa.me/');
        else alert('Link kopyalandı!');
        closeGUI('share-gui');
    }
};

// Enter Tuşu Dinleyicisi
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('userInput')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            uiManager.sendMessage();
        }
    });
});
