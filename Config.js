class Config {
    static serverRequestLink = 'http://david.jamnig.net/tests/fittslaw/server/update.php';
    static sendDataToServer = false;
    // Calculation - Fullscreen -> Get windowInnerWidth/Height as resolution and inch of screen. Then calculate the ppi
    static ppi = 96; // Cannot be determined by plain javascript
    static experimentType = "STS";
    static shape = "rectangle"; // rectangle or circle
    static intDevice = "mouse".toLowerCase(); // Mouse, Touch
    static trialsPerBreak = NaN;
    static generalUsername = "none"; // Will be displayed in dataset when no username was entered
    static version = "3.1";

    // Block Config
    static startSize = 10; // Size of the start block (always AxA)
    static numBlocks = 3;
    // Category, targetWidth, targetHeight, Amplitude, trialDirection
    // up, up-right, right-up, right, right-down, down-right, down, down-left,
    // left-down, left, left-up, up-left
    // Circle: width => height
    static trialsDataCategories = [
        ["C1", 50, 10, 30, 'up-left'],
        //["C1", 50, 10, 30, 'left-down'],
        // ["C1", 50, 10, 30, 'Up'],
        // ["C1", 50, 10, 30, 'Up'],
        // ["C2", 10, 10, 20, 'up-left'],
        // ["C3", 10, 10, 20, 'left-down'],
        // ["C4", 10, 10, 20, 'left'],
    ];

    // Clock: 12 (up), 1 (up-right), 2 (right-up), 3...
    static clockDirections = { // Possible directions with specified angle
        'up': 90,
        'up-right': 120,
        'right-up': 150,
        'right': 180,
        'right-down': 210,
        'down-right': 240,
        'down': 270,
        'down-left': 300,
        'left-down': 330,
        'left': 360,
        'left-up': 30,
        'up-left': 60,
    };

    // Determines clickTolerance (in px) where click is counted as miss
    static clickTolerance(amplitude) {
        return mm2px(amplitude / 2);
    }

    static isMissSkipped = true; // True - Miss click will be skipped / False - Nothing will be skipped
    static reAddMisses = true; // Readds misses within the same block in a random position

    static elementStrokeStyle = "black"; // object border color
    static startElementFillStyle = "rgba(144, 238, 144, 0.8)";
    static targetElementFillStyle = [
        "rgba(255, 102, 102, 0.8)",
        "rgba(255, 171, 0, 0.8)",
        "rgba(39, 235, 202, 0.8)",
        "rgba(133, 68, 218, 0.8)",
        "rgba(170, 218, 75, 0.8)",
        "rgba(220, 110, 217, 0.8)"];
    static targetElementSelectionStyle = "rgba(0, 0, 139, 0.8)"; // Dark blue color
}