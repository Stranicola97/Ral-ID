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


