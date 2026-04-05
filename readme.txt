$env:OLLAMA_ORIGINS="*"; $env:OLLAMA_HOST="0.0.0.0"; ollama serve
$env:OLLAMA_ORIGINS="*"; ollama serve
ngrok http 11434 --host-header="localhost:11434"
