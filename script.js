const video = document.getElementById('video');

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log('Flusso video acquisito:', stream); // Aggiungi questo per verificare
        video.srcObject = stream;
    } catch (err) {
        console.error('Errore nell\'accesso alla fotocamera:', err);
    }
}

startCamera();
