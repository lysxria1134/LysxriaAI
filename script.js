// --- LYSXRIA AI PRO - OPTİMİZE SCRIPT ---

// Eğer bir Python/Flask backend kullanacaksan ngrok linkini buraya yaz
const NGROK_URL = "https://SENIN-NGROK-LINKIN.ngrok-free.app/chat"; 

const uiManager = {
    // Mesaj Gönderme Fonksiyonu
    sendMessage: async () => {
        const inp = document.getElementById('userInput');
        const win = document.getElementById('chat-window');
        const userText = inp.value.trim();

        if (!userText) return;

        // Tanıtım yazısını ilk mesajda gizle
        const intro = document.getElementById('intro-text');
        if (intro) intro.style.display = 'none';

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
            // TinyLlama / Hızlı Yanıt İçin Fetch İsteyi
            // Not: Tam optimizasyon için yerel WebLLM veya bu API ucunu kullanabilirsin
            const response = await fetch(NGROK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: userText,
                    model: "tinyllama",
                    stream: false 
                })
            });

            const data = await response.json();
            aiMsgDiv.innerText = data.reply || "Bağlantı hatası oluştu.";
            
        } catch (error) {
            // Eğer backend yoksa simüle edilmiş hızlı yanıt (Test için)
            setTimeout(() => {
                aiMsgDiv.innerText = "Şu an ngrok bağlantısı kurulmadığı için demo modundayım. Lütfen script.js içindeki NGROK_URL kısmını güncelleyin.";
            }, 1000);
        }

        win.scrollTop = win.scrollHeight;
    },

    // Dil Değiştirme Fonksiyonu (index4.html ile tam uyumlu)
    changeLang: (lang) => {
        const isTr = lang === 'tr';
        document.querySelectorAll('[data-tr]').forEach(el => {
            el.innerText = isTr ? el.getAttribute('data-tr') : el.getAttribute('data-en');
        });
        
        // Form elemanlarını güncelle
        document.getElementById('userInput').placeholder = isTr ? 'Mesajınızı buraya bırakın...' : 'Leave your message here...';
        document.getElementById('reg-name').placeholder = isTr ? 'İsim' : 'Name';
        document.getElementById('reg-mail').placeholder = isTr ? 'Gmail' : 'Email';
        
        const authBtn = document.getElementById('auth-btn');
        if (authBtn) authBtn.innerText = isTr ? 'Sisteme Gir' : 'Enter System';

        const introContent = document.getElementById('intro-content');
        if (introContent) {
            introContent.innerText = isTr ? 
                "Lysxria AI, modern tasarımı ve güçlü altyapısıyla size en iyi deneyimi sunmak için burada. Her türlü sorunuzu sorabilir, projelerinizde yardım alabilir veya sadece sohbet edebilirsiniz." : 
                "Lysxria AI is here to provide you with the best experience with its modern design and powerful infrastructure. You can ask any question or just chat.";
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
        if(platform === 'whatsapp') {
            window.open('https://wa.me/?text=Lysxria%20AI%20ile%20tanışın!');
        } else {
            alert('Bağlantı kopyalandı!');
        }
        closeGUI('share-gui');
    }
};

// Enter tuşu ile mesaj gönderme optimizasyonu
document.getElementById('userInput')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        uiManager.sendMessage();
    }
});