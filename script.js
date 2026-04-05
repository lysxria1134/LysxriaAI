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
                document.getElementById('chat-window').scrollTop = 99999;
            }
        }
        type();
    },

    sendMessage: async () => {
        const inp = document.getElementById('userInput');
        const win = document.getElementById('chat-window');
        const intro = document.getElementById('intro-text'); // ID Düzeltildi
        const userText = inp.value.trim();

        if (!userText) return;

        // Mesaj gelince tanıtımı kaldır
        if (intro) intro.style.display = 'none';

        win.innerHTML += `<div class="msg user">${userText}</div>`;
        inp.value = '';
        win.scrollTop = win.scrollHeight;

        const aiMsgDiv = document.createElement('div');
        aiMsgDiv.className = 'msg ai';
        aiMsgDiv.innerText = "Düşünüyor...";
        win.appendChild(aiMsgDiv);

        try {
            const response = await fetch(lobeliaceous-nonintrospectively-irene.ngrok-free.dev/api/generate";/api/generate, {
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
            const finalReply = data.response || data.reply || "Cevap boş döndü.";
            
            uiManager.typeWriter(aiMsgDiv, finalReply);

        } catch (error) {
            aiMsgDiv.innerText = "Bağlantı hatası! Ngrok veya Ollama kapalı olabilir.";
            aiMsgDiv.style.color = "#ff4d4d";
        }
    },

    // Dil ve Diğer GUI Fonksiyonlarını Buraya Eklemelisin (index.html'den taşı)
    changeLang: (lang) => { /* HTML içindeki kodun aynısı buraya gelmeli */ },
    rate: (num) => { /* HTML içindeki kodun aynısı buraya gelmeli */ }
};

// Enter Tuşu
document.getElementById('userInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        uiManager.sendMessage();
    }
});
