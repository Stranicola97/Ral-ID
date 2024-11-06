const video = document.getElementById('video');
const captureButton = document.getElementById('capture');
const resultDiv = document.getElementById('result');
const colorSquare = document.getElementById('colorSquare');

// Modified constraints for mobile compatibility
const constraints = {
    video: {
        facingMode: "environment", // Use the rear camera on mobile
        width: { ideal: 640 },
        height: { ideal: 480 }
    }
};

// Request access to the camera and start the video stream
function startCamera() {
    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            video.srcObject = stream;

            // Attempt to play the video explicitly after setting the stream
            video.onloadedmetadata = () => {
                video.play();
            };

            video.addEventListener('loadeddata', () => {
                if (video.readyState >= 2) {
                    video.play(); // Ensure video playback
                }
            });
        })
        .catch(err => {
            console.error("Error accessing the camera: ", err);
            alert("Error accessing the camera. Please check permissions.");
        });
}

// Call the function to start the camera when the page loads
startCamera();

// Capture button event listener (same as previous code)
captureButton.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const color = getDominantColor(imageData);
    
    const nearestRAL = getNearestRALColor(color);
    resultDiv.innerHTML = `Colore catturato: ${color} <br> Codice RAL più vicino: ${nearestRAL}`;
    
    // Set the background color of the colored square
    colorSquare.style.backgroundColor = `rgb(${color})`;
});

// Function to get dominant color (same as before)
function getDominantColor(imageData) {
    const data = imageData.data;
    let r = 0, g = 0, b = 0, count = 0;

    for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
    }

    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);

    return `${r},${g},${b}`;
}

// Function to get nearest RAL color (same as before)
function getNearestRALColor(capturedColor) {
    const [r, g, b] = capturedColor.split(',').map(Number);
    let nearestRAL = null;
    let minDistance = Infinity;

    for (const color of ralColors) {
        const [rr, gg, bb] = color.rgb.split(',').map(Number);
        const distance = Math.sqrt((r - rr) ** 2 + (g - gg) ** 2 + (b - bb) ** 2);

        if (distance < minDistance) {
            minDistance = distance;
            nearestRAL = color.code;
        }
    }

    return nearestRAL;
}
