// Get references to the video and canvas elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const startCameraButton = document.getElementById('start-camera');
const captureColorButton = document.getElementById('capture-color');

// Set up a context for the canvas
const ctx = canvas.getContext('2d');

// Function to start the camera and stream it to the video element
function startCamera() {
    // Check if the browser supports getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Set video constraints to use rear camera if available
        const constraints = {
            video: {
                facingMode: "environment", // Use the rear camera
                width: { ideal: 1280 },     // Set ideal video width
                height: { ideal: 720 }      // Set ideal video height
            }
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
                video.srcObject = stream;
                video.onloadedmetadata = () => {
                    video.play();
                };
            })
            .catch(err => {
                console.error("Camera access denied", err);
                alert("Please allow camera access to use this feature.");
            });
    } else {
        alert("Camera not supported by your browser.");
    }
}

// Event listener for the button to start the camera
startCameraButton.addEventListener('click', () => {
    startCamera();
});

// Function to capture an image from the video and extract RGB
function captureColor() {
    // Draw the current frame from the video to the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get pixel data from the canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Get the RGB values from the center of the canvas
    const x = Math.floor(canvas.width / 2);
    const y = Math.floor(canvas.height / 2);
    const index = (y * canvas.width + x) * 4;

    const r = pixels[index];
    const g = pixels[index + 1];
    const b = pixels[index + 2];

    // Display the RGB values and change the square color
    document.getElementById('rgb-display').textContent = `RGB: (${r}, ${g}, ${b})`;
    document.getElementById('color-square').style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

// Add event listener to capture the color when clicking a button
captureColorButton.addEventListener('click', captureColor);
