const video = document.getElementById('video');
const captureButton = document.getElementById('capture');
const resultDiv = document.getElementById('result');
const colorSquare = document.getElementById('colorSquare'); // Reference to the colored square

// Request access to the camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Error accessing the camera: ", err);
    });

// RAL color mapping
const ralColors = [
    { code: 'RAL 1000', rgb: '162,124,43' }, // Example RAL colors
    { code: 'RAL 1001', rgb: '169,123,48' },
    { code: 'RAL 1002', rgb: '175,131,50' },
    { code: 'RAL 2000', rgb: '85,59,29' },
    { code: 'RAL 2001', rgb: '150,45,25' },
    // Add more RAL colors as needed
];

// Function to get the dominant color from the image data
function getDominantColor(imageData) {
    const data = imageData.data;
    let r = 0, g = 0, b = 0, count = 0;

    for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
    }

    // Average the RGB values
    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);

    return `${r},${g},${b}`; // Return as a string "r,g,b"
}

// Function to find the nearest RAL color
function getNearestRALColor(capturedColor) {
    const [r, g, b] = capturedColor.split(',').map(Number); // Convert RGB string to numbers
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

// Capture button event listener
captureButton.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const color = getDominantColor(imageData);
    
    const nearestRAL = getNearestRALColor(color); // Get nearest RAL code
    resultDiv.innerHTML = `Colore catturato: ${color} <br> Codice RAL più vicino: ${nearestRAL}`;
    
    // Set the background color of the colored square
    colorSquare.style.backgroundColor = `rgb(${color})`; 

    console.log('Colore catturato:', color);
});



