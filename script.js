// --- LYSXRIA AI PRO - OPTİMİZE SCRIPT ---

// Kullanıcının verdiği güncel ngrok URL'si
const NGROK_URL = "https://lobeliaceous-nonintrospectively-irene.ngrok-free.dev/chat"; 

const uiManager = {
    // Mesaj Gönderme Fonksiyonu (Hız ve Hata Kontrolü Optimize Edildi)
    sendMessage: async () => {
        const inp = document.getElementById('userInput');
        const win = document.getElementById('chat-window');
        const userText = inp.value.trim();

        if (!userText) return;

        // Tanıtım yazısını ilk mesajda gizle
        const intro = document.getElementById('intro-text');
        if (intro && intro.style.display !== 'none') {
            intro.style.display = 'none';
        }

        // Kullanıcı mesajını ekrana bas
        win.innerHTML += `<div class="msg user">${userText}</div>`;
        inp.value = '';
        win.scrollTop = win.scrollHeight;

        // AI Yanıt Bekleme Alanı (Loading)
        const aiMsgDiv = document.createElement('div');
        aiMsgDiv.className = 'msg ai';
        aiMsgDiv.innerText = "...";
        win.appendChild(aiMsgDiv);

        try {
            // Hızlı yanıt için fetch zaman aşımı ve hata kontrolü
            const response = await fetch(NGROK_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true' // Ngrok uyarı sayfasını atlamak için kritik
                },
                body: JSON.stringify({ 
                    message: userText,
                    model: "tinyllama"
                })
            });

            if (!response.ok) throw new Error("Ağ hatası");

            const data = await response.json();
            aiMsgDiv.innerText = data.reply || data.response || "Yanıt alınamadı.";
            
        } catch (error) {
            console.error("Hata:", error);
            aiMsgDiv.innerText = "Bağlantı hatası: Lütfen ngrok sunucusunun aktif olduğundan emin olun.";
            aiMsgDiv.style.color = "#ff4d4d";
        }

        win.scrollTop = win.scrollHeight;
    },

    // Dil Değiştirme Fonksiyonu (index4.html ile tam uyumlu)
    changeLang: (lang) => {
        const isTr = lang === 'tr';
        document.querySelectorAll('[data-tr]').forEach(el => {
            el.innerText = isTr ? el.getAttribute('data-tr') : el.getAttribute('data-en');
        });
        
        // Form ve içerik çevirileri
        const elements = {
            'userInput': isTr ? 'Mesajınızı buraya bırakın...' : 'Leave your message here...',
            'reg-name': isTr ? 'İsim' : 'Name',
            'reg-mail': isTr ? 'Gmail' : 'Email',
            'auth-btn': isTr ? 'Sisteme Gir' : 'Enter System',
            'intro-content': isTr ? 
                "Lysxria AI, modern tasarımı ve güçlü altyapısıyla size en iyi deneyimi sunmak için burada. Her türlü sorunuzu sorabilir, projelerinizde yardım alabilir veya sadece sohbet edebilirsiniz. Lysxria dünyasına hoş geldiniz!" : 
                "Lysxria AI is here to provide you with the best experience with its modern design and powerful infrastructure. You can ask any question, get help with your projects, or just chat. Welcome to the world of Lysxria!"
        };

        for (let id in elements) {
            const el = document.getElementById(id);
            if (el) {
                if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') el.placeholder = elements[id];
                else el.innerText = elements[id];
            }
        }
        
        closeGUI('lang-gui');
    },

    // Zeka Modu Ayarı
    setMode: (name, labelText) => {
        const label = document.getElementById('mode-label');
        if (label) {
            label.innerText = labelText || name.toUpperCase();
            label.style.display = 'block';
        }
        closeGUI('model-gui');
    },

    // Dinamik Yıldız Puanlama
    rate: (num) => {
        const stars = document.querySelectorAll('.star');
        stars.forEach((s, i) => {
            s.classList.toggle('active', i < num);
        });
    },

    // Paylaşım Fonksiyonu
    share: (platform) => {
        const text = encodeURIComponent("Lysxria AI PRO ile tanışın!");
        if(platform === 'whatsapp') {
            window.open(`https://wa.me/?text=${text}`);
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link kopyalandı!');
        }
        closeGUI('share-gui');
    }
};

// Enter tuşu dinleyicisi (Hızlı gönderim için)
document.getElementById('userInput')?.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        uiManager.sendMessage();
    }
});
