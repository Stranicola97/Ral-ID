const video = document.getElementById('video');
let stream; // Aggiungiamo una variabile per memorizzare il flusso

async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.error('Errore nell\'accesso alla fotocamera:', err);
    }
}

function stopCamera() {
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    }
    video.srcObject = null; // Rimuoviamo il flusso video
}

document.getElementById('capture').addEventListener('click', stopCamera);

startCamera();

