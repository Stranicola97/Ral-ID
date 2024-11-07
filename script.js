const video = document.getElementById('video');
const colorSquare = document.getElementById('color-square');
const rgbDisplay = document.getElementById('rgb-display');
const ralDisplay = document.getElementById('ral-display');
let capturedRGB = [0, 0, 0]; // Default RGB value

// Start the camera
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        console.error('Camera access error: ', error);
    });

// Load the RAL data from the JSON file
let ralData = [];
fetch('ral_colors.json')
    .then(response => response.json())
    .then(data => {
        ralData = data;
    })
    .catch(error => console.error('Error loading RAL data:', error));

// Function to capture color from the video
function captureColor() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const frame = context.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data;
    capturedRGB = [frame[0], frame[1], frame[2]];

    // Update the UI
    colorSquare.style.backgroundColor = `rgb(${capturedRGB[0]}, ${capturedRGB[1]}, ${capturedRGB[2]})`;
    rgbDisplay.textContent = `Captured RGB: ${capturedRGB.join(', ')}`;

    // Find the nearest RAL color
    const nearestRAL = findNearestRAL(capturedRGB);
    if (nearestRAL) {
        ralDisplay.textContent = `Nearest RAL Color: ${nearestRAL.ral_code}, RGB: ${nearestRAL.rgb}`;
    } else {
        ralDisplay.textContent = 'RAL data is not loaded or no match found.';
    }
}

// Function to find the nearest RAL color using Euclidean distance
function findNearestRAL(rgb) {
    let nearestRAL = null;
    let minDistance = Infinity;

    ralData.forEach(item => {
        const ralRGB = item.rgb;
        const distance = Math.sqrt(
            Math.pow(rgb[0] - ralRGB[0], 2) +
            Math.pow(rgb[1] - ralRGB[1], 2) +
            Math.pow(rgb[2] - ralRGB[2], 2)
        );

        if (distance < minDistance) {
            minDistance = distance;
            nearestRAL = item;
        }
    });

    return nearestRAL;
}

// Event listener for the button
document.getElementById('capture-color').addEventListener('click', captureColor);
