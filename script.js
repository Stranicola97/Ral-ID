// Load the RAL data from the JSON file
let ralData = [];
fetch('ral_colors.json')
    .then(response => response.json())
    .then(data => {
        ralData = data;
    })
    .catch(error => console.error('Error loading RAL data:', error));

// Function to find the nearest RAL color
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

// Update the function when a color is captured
document.getElementById('capture-color').addEventListener('click', function () {
    // Assuming `capturedRGB` contains the captured RGB value
    const nearestRAL = findNearestRAL(capturedRGB);

    if (nearestRAL) {
        alert(`Nearest RAL Color: ${nearestRAL.ral_code}, RGB: ${nearestRAL.rgb}`);
        // Optionally, display this info in a dedicated section of the UI
        document.getElementById('ral-display').textContent = 
            `Nearest RAL Color: ${nearestRAL.ral_code}, RGB: ${nearestRAL.rgb}`;
    } else {
        alert('RAL data is not loaded or no match found.');
    }
});
