// Prendere l'elemento video dalla pagina
const video = document.getElementById('video');

// Funzione per iniziare a catturare il flusso video dalla fotocamera
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.error('Errore nell\'accesso alla fotocamera:', err);
    }
}

// Inizializzare la fotocamera quando la pagina è pronta
startCamera();
