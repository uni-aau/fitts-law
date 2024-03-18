const experimentFrame = new ExperimentFrame();
let isFullScreen = false;

// Function to show the start window
function showStartWindow() {
    // Get the break window modal
    const startWindow = document.getElementById('startWindow');
    // Show the modal
    startWindow.style.display = 'block';
    // Disable the rest of the page interaction while the start window is visible
    document.body.style.pointerEvents = 'none';

    const fullScreenButton = document.getElementById("fullScreenButton");
    fullScreenButton.addEventListener("click", handleFullScreen);
}

function handleFullScreen() {
    const canvas = document.documentElement;
    if (!isFullScreen) {
        enableFullScreen(canvas)
        isFullScreen = true;
    } else {
        disableFullScreen();
        isFullScreen = false;
    }
}

// Function to start the experiment in full-screen mode
function startExperiment(isTestSet) {
    Config.isTestSet = isTestSet;
    // Hide the start window
    const startWindow = document.getElementById('startWindow');
    startWindow.style.display = 'none';

    // Enable the page interaction again
    document.body.style.pointerEvents = 'auto';

    // Start the experiment
    experimentFrame.initializeExperiment();
}

// Event listener for the start button
const startTestButton = document.getElementById('startTestButton');
startTestButton.addEventListener('click', () => startExperiment(true));
const startTrainingsButton = document.getElementById('startTrainingButton');
startTrainingsButton.addEventListener('click', () => startExperiment(false));

// Show the start window
if (Config.showStartWindow) showStartWindow();
else startExperiment();

function enableFullScreen(canvas) {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.mozRequestFullScreen) { // Firefox
        canvas.mozRequestFullScreen();
    } else if (canvas.webkitRequestFullscreen) { // Chrome, Safari and Opera
        canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) { // IE/Edge
        canvas.msRequestFullscreen();
    } else {
        console.error("Error enabling fullscreen")
    }
}

function disableFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else {
        console.error("Error disabling fullscreen")
    }
}
