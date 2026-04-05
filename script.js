// --- LYSXRIA AI PRO - OPTİMİZE SCRIPT ---

// Görseldeki ngrok bilgisine göre güncellendi
const NGROK_URL = "https://lobeliaceous-nonintrospectively-irene.ngrok-free.dev/api/generate"; 

const uiManager = {
    // Kelime kelime yazma efekti (ChatGPT stili)
    typeWriter: (element, text, speed = 20) => {
        let i = 0;
        element.innerText = "";
        function type() {
            if (i < text.length) {
                element.innerText += text.charAt(i);
                i++;
                setTimeout(type, speed);
                document.getElementById('chat-window').scrollTop = 99999;
            }
        }
        type();
    },

    sendMessage: async () => {
        const inp = document.getElementById('userInput');
        const win = document.getElementById('chat-window');
        const userText = inp.value.trim();

        if (!userText) return;

        // Hoşgeldin yazısını gizle
        const hero = document.getElementById('welcome-hero');
        if (hero) hero.style.display = 'none';

        // Kullanıcı mesajını ekle
        win.innerHTML += `<div class="msg user">${userText}</div>`;
        inp.value = '';
        win.scrollTop = win.scrollHeight;

        // AI Yanıt Kutusu (Boş olarak oluşturulur)
        const aiMsgDiv = document.createElement('div');
        aiMsgDiv.className = 'msg ai';
        aiMsgDiv.innerText = "Thinking...";
        win.appendChild(aiMsgDiv);

        try {
            const response = await fetch(NGROK_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true' // Ngrok ekranını atlamak için şart
                },
                body: JSON.stringify({ 
                    model: "tinyllama", // Ollama'da yüklü olan model adı
                    prompt: userText,
                    stream: false // Hızlı cevap için şimdilik false (tek parça alıp biz yazdıracağız)
                })
            });

            if (!response.ok) throw new Error("API Hatası");

            const data = await response.json();
            const finalReply = data.response || data.reply;
            
            // Cevabı tak diye basmak yerine efektle yazdırıyoruz
            uiManager.typeWriter(aiMsgDiv, finalReply);

        } catch (error) {
            console.error("Sistem Hatası:", error);
            aiMsgDiv.innerText = "Bağlantı kesildi. Lütfen ngrok ve Ollama'nın çalıştığından emin olun.";
            aiMsgDiv.style.color = "#ff4d4d";
        }
    }
};

// Enter tuşunu bağla
document.getElementById('userInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        uiManager.sendMessage();
    }
});

// Sayfa yüklendiğinde auth kontrolü (index4.html'deki gibi)
window.onload = () => {
    if (typeof authManager !== 'undefined') authManager.check();
};
