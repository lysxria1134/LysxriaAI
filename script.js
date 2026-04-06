// --- DEĞİŞKENLER VE 초기화 ---
let userData = JSON.parse(localStorage.getItem('user')) || null;
const ngrokUrl = "https://lobeliaceous-nonintrospectively-irene.ngrok-free.dev/api/generate";

window.onload = () => {
    if (userData) {
        authManager.check();
    }
};

// --- KAYIT VE OTURUM YÖNETİMİ ---
const authManager = {
    register: () => {
        const name = document.getElementById('reg-name').value;
        const mail = document.getElementById('reg-mail').value;
        if (name && mail) {
            userData = { name, mail };
            localStorage.setItem('user', JSON.stringify(userData));
            authManager.check();
        } else {
            alert("Lütfen tüm alanları doldurun!");
        }
    },
    check: () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            document.getElementById('auth-overlay').style.display = 'none';
            document.getElementById('p-display-name').innerText = user.name;
            document.getElementById('p-display-mail').innerText = user.mail;
        }
    },
    logout: () => {
        localStorage.removeItem('user');
        location.reload();
    }
};

// --- ARAYÜZ VE SOHBET YÖNETİMİ ---
const uiManager = {
    // İnsan gibi yazma efekti
    typeEffect: async (element, text) => {
        element.innerHTML = "";
        for (let i = 0; i < text.length; i++) {
            element.innerHTML += text.charAt(i);
            // Rastgele hız simülasyonu (30ms - 70ms arası)
            await new Promise(resolve => setTimeout(resolve, Math.random() * 40 + 30));
            document.getElementById('chat-window').scrollTop = 99999;
        }
    },

    sendMessage: async () => {
        const input = document.getElementById('userInput');
        const win = document.getElementById('chat-window');
        const text = input.value.trim();

        if (!text) return;

        // Giriş yazısını gizle
        document.getElementById('intro-text').style.display = 'none';

        // Kullanıcı mesajını ekle
        win.innerHTML += `<div class="msg user">${text}</div>`;
        input.value = '';
        win.scrollTop = 99999;

        // AI Düşünüyor baloncuğu
        const aiMsgDiv = document.createElement('div');
        aiMsgDiv.className = 'msg ai';
        aiMsgDiv.innerText = "...";
        win.appendChild(aiMsgDiv);

        try {
            const response = await fetch(ngrokUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'tinyllama',
                    prompt: text,
                    stream: false
                })
            });

            const data = await response.json();
            const aiResponse = data.response;

            // Yazma efektini başlat
            await uiManager.typeEffect(aiMsgDiv, aiResponse);

        } catch (error) {
            aiMsgDiv.innerText = "Bağlantı hatası: Sunucuya ulaşılamıyor.";
            console.error("Hata:", error);
        }
    },

    setMode: (name, labelText) => {
        const label = document.getElementById('mode-label');
        label.innerText = labelText || name.toUpperCase();
        label.style.display = 'block';
        closeGUI('model-gui');
    },

    changeLang: (lang) => {
        const isTr = lang === 'tr';
        document.querySelectorAll('[data-tr]').forEach(el => {
            el.innerText = isTr ? el.getAttribute('data-tr') : el.getAttribute('data-en');
        });
        document.getElementById('userInput').placeholder = isTr ? 'Mesajınızı buraya bırakın...' : 'Leave your message here...';
        closeGUI('lang-gui');
    }
};

// --- YARDIMCI FONKSİYONLAR ---
function openGUI(id) {
    const el = document.getElementById(id);
    el.style.display = 'block';
    setTimeout(() => el.classList.add('open'), 10);
    document.getElementById('sidebar').classList.remove('open');
}

function closeGUI(id) {
    const el = document.getElementById(id);
    el.classList.remove('open');
    setTimeout(() => el.style.display = 'none', 600);
}

// Enter tuşu ile gönderme
document.getElementById('userInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        uiManager.sendMessage();
    }
});
