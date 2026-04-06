// ===== LYSXRIA AI PRO - SCRIPT.JS =====
// Ngrok URL'ini buraya yapıştır
const NGROK_URL = "https://lobeliaceous-nonintrospectively-irene.ngrok-free.dev/api/generate";

// ===== GENIŞLETILMIŞ UI MANAGER =====
const uiManager = {
    // Yazma Efekti (TypeWriter)
    typeWriter: (element, text, speed = 20) => {
        let i = 0;
        element.innerHTML = "";
        element.style.color = "#ececf1";
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
                const win = document.getElementById('chat-window');
                if(win) win.scrollTop = win.scrollHeight;
            }
        }
        type();
    },

    // AI'ya Mesaj Gönder
    sendMessage: async () => {
        const inp = document.getElementById('userInput');
        const win = document.getElementById('chat-window');
        const intro = document.getElementById('intro-text');
        const userText = inp.value.trim();

        if (!userText) return;

        // Tanıtım yazısını gizle
        if (intro) intro.style.display = 'none';

        // Kullanıcı mesajını göster
        const userMsgDiv = document.createElement('div');
        userMsgDiv.className = 'msg user';
        userMsgDiv.innerText = userText;
        win.appendChild(userMsgDiv);
        
        inp.value = '';
        win.scrollTop = win.scrollHeight;

        // "Düşünüyor..." mesajı göster
        const aiMsgDiv = document.createElement('div');
        aiMsgDiv.className = 'msg ai';
        aiMsgDiv.innerHTML = "⏳ Düşünüyor...";
        win.appendChild(aiMsgDiv);
        win.scrollTop = win.scrollHeight;

        try {
            // Ollama/Ngrok'a istek gönder
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

            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status}`);
            }

            const data = await response.json();
            const finalReply = data.response || data.reply || "Cevap alınamadı.";
            
            // Yazma efekti ile cevabı göster
            uiManager.typeWriter(aiMsgDiv, finalReply);

        } catch (error) {
            console.error("Ollama Hata:", error);
            aiMsgDiv.innerHTML = `<span style="color: #ff6b6b;">❌ Bağlantı Hatası!</span>\n\n${error.message}\n\n<span style="color: #ffa500;">💡 Kontrol et:</span>\n• Ollama açık mı?\n• Ngrok çalışıyor mu?\n• URL doğru mu?`;
            aiMsgDiv.style.whiteSpace = 'pre-wrap';
        }
    },

    // Mod Seç
    setMode: (name, labelText) => {
        const label = document.getElementById('mode-label');
        if(label) {
            label.innerText = labelText || name.toUpperCase();
            label.style.display = 'block';
        }
        closeGUI('model-gui');
    },

    // Dil Değiştir
    changeLang: (lang) => {
        const isTr = lang === 'tr';
        document.querySelectorAll('[data-tr]').forEach(el => {
            el.innerText = isTr ? el.getAttribute('data-tr') : el.getAttribute('data-en');
        });
        document.getElementById('userInput').placeholder = isTr ? 'Mesajınızı buraya bırakın...' : 'Leave your message here...';
        closeGUI('lang-gui');
    },

    // Yıldızla Puanla
    rate: (num) => {
        const stars = document.querySelectorAll('.star');
        stars.forEach((s, i) => {
            if(i < num) s.classList.add('active');
            else s.classList.remove('active');
        });
    },

    // Paylaş
    share: (platform) => {
        const url = window.location.href;
        if(platform === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent('Lysxria AI PRO: ' + url)}`);
        } else if(platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=Lysxria AI PRO`);
        } else if(platform === 'instagram') {
            alert('Bağlantı kopyalandı! Instagram\'da paylaşabilirsin.\n\n' + url);
        }
        closeGUI('share-gui');
    }
};

// ===== GUI FONKSİYONLARI =====
function openGUI(id) {
    const el = document.getElementById(id);
    el.style.display = 'block';
    setTimeout(() => el.classList.add('open'), 10);
    document.getElementById('sidebar')?.classList.remove('open');
}

function closeGUI(id) {
    const el = document.getElementById(id);
    el.classList.remove('open');
    setTimeout(() => el.style.display = 'none', 600);
}

// ===== İNTERNET SİNYALİ ANİMASYONU =====
setInterval(() => {
    const bars = document.querySelectorAll('.bar');
    const strength = Math.floor(Math.random() * 4) + 1;
    bars.forEach((b, i) => {
        b.className = 'bar bar' + (i + 1);
        if(i < strength) {
            if(strength === 1) b.classList.add('red');
            else b.classList.add('green');
        }
    });
}, 3000);

// ===== SIDEBAR KAPATMA =====
window.onclick = (e) => {
    if(e.target.id === 'chat-window' || e.target.id === 'main') {
        document.getElementById('sidebar')?.classList.remove('open');
    }
};

// ===== ENTER TUŞU DÖNÜŞTÜRÜCÜSİ =====
document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                uiManager.sendMessage();
            }
        });
    }
});
