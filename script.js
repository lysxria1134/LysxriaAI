async function sendMessage() {
    const input = document.getElementById('userInput');
    const val = input.value.trim();
    if (!val) return;

    if (!currentChatId) currentChatId = Date.now();
    document.getElementById('welcome-hero').style.display = 'none';

    addBubble('user', val);
    input.value = '';
    input.style.height = 'auto';

    // AI cevabı için boş bir balon oluştur
    const aiBubble = addBubble('ai', '...');
    let fullAiResponse = "";

    try {
        const response = await fetch('https://lobeliaceous-nonintrospectively-irene.ngrok-free.dev/api/generate', {
            method: 'POST',
            body: JSON.stringify({ 
                model: 'tinyllama', 
                prompt: val, 
                stream: true  // HIZ İÇİN KRİTİK: Akışı açtık
            })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (!line) continue;
                const json = JSON.parse(line);
                if (json.response) {
                    fullAiResponse += json.response;
                    aiBubble.innerText = fullAiResponse; // Kelime kelime ekrana basar
                    document.getElementById('chat-window').scrollTop = document.getElementById('chat-window').scrollHeight;
                }
            }
        }
        lastAiResponse = fullAiResponse;
        saveChat(val, fullAiResponse);

    } catch (e) {
        aiBubble.innerText = "Hata: Bağlantı yavaş veya koptu.";
        console.error(e);
    }
}

// addBubble fonksiyonunu küçük bir değişiklikle güncellememiz lazım
function addBubble(role, text) {
    const win = document.getElementById('chat-window');
    const div = document.createElement('div');
    div.className = `msg ${role}`;
    div.innerText = text;
    win.appendChild(div);
    win.scrollTop = win.scrollHeight;
    return div; // Balonu geri döndür ki içeriğini güncelleyebilelim
}
