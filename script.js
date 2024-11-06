const video = document.getElementById('video');
const captureButton = document.getElementById('capture');
const resultDiv = document.getElementById('result');
const colorSquare = document.getElementById('colorSquare');

// Video constraints for better mobile compatibility
const constraints = {
    video: {
        facingMode: "environment", // Rear camera
        width: { ideal: 640 },
        height: { ideal: 480 }
    }
};

// Initialize camera
function startCamera() {
    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            video.srcObject = stream;
            video.onloadedmetadata = () => {
                video.play();
            };
        })
        .catch(err => {
            console.error("Camera access error: ", err);
            alert("Error accessing the camera. Please check permissions.");
        });
}

// Start camera on page load
startCamera();

// Capture button event listener
captureButton.addEventListener('click', () => {
    console.log("Capture button clicked");

    if (!video.srcObject) {
        console.error("Video stream is not active.");
        return;
    }

    // Create a canvas to capture the frame
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the pixel data from the canvas
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const color = getDominantColor(imageData);

    console.log("Dominant color (RGB):", color);

    // Find the nearest RAL color
    const nearestRAL = getNearestRALColor(color);
    resultDiv.innerHTML = `Captured color: rgb(${color}) <br> Nearest RAL code: ${nearestRAL}`;

    // Update the color display square
    colorSquare.style.backgroundColor = `rgb(${color})`;
});

// Function to calculate dominant color
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

// Function to find the nearest RAL color
function getNearestRALColor(capturedColor) {
    const [r, g, b] = capturedColor.split(',').map(Number);
    let nearestRAL = null;
    let minDistance = Infinity;

    const ralColors = [
        { code: 'RAL 1000', rgb: '162,124,43' },
        { code: 'RAL 1001', rgb: '169,123,48' },
        { code: 'RAL 1002', rgb: '175,131,50' },
        { code: 'RAL 2000', rgb: '85,59,29' },
        { code: 'RAL 2001', rgb: '150,45,25' }
        // Add more RAL colors as needed
    ];

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
