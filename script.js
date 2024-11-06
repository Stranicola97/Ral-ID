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
    const color = getAverageColor(imageData);

    // Display the RGB color
    resultDiv.innerHTML = `Captured RGB color: rgb(${color})`;

    // Update the color display square
    colorSquare.style.backgroundColor = `rgb(${color})`;
});

// Function to calculate the average RGB color
function getAverageColor(imageData) {
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
