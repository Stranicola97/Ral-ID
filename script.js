const video = document.getElementById('video');

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;

        // Log to check if the stream is set correctly
        video.onloadedmetadata = function() {
            console.log('Video stream loaded');
            video.play(); // Explicitly start the video playback
        };
    } catch (err) {
        console.error('Error accessing the camera:', err);
    }
}

startCamera();

const captureButton = document.getElementById('capture');
const resultDiv = document.getElementById('result');

captureButton.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const color = getDominantColor(imageData);
    
    resultDiv.innerHTML = `Colore catturato: ${color}`;
    console.log('Colore catturato:', color);
});

function getDominantColor(imageData) {
    // Algoritmo semplice per trovare il colore dominante
    const data = imageData.data;
    const length = data.length;
    const colorCounts = {};
    let dominantColor = '';
    let maxCount = 0;

    for (let i = 0; i < length; i += 4) {
        const color = `${data[i]},${data[i + 1]},${data[i + 2]}`; // RGB
        colorCounts[color] = (colorCounts[color] || 0) + 1;

        if (colorCounts[color] > maxCount) {
            maxCount = colorCounts[color];
            dominantColor = color;
        }
    }

    return dominantColor; // Restituisce il colore dominante in formato "R,G,B"
}



