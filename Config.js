class Config {
    static isDebug = false;
    static serverRequestLink = 'http://david.jamnig.net/tests/fittslaw/server/update.php';
    static sendDataToServer = false;
    // Calculation - Fullscreen -> Get windowInnerWidth/Height as resolution and inch of screen. Then calculate the ppi
    static ppi = 137.61; // Cannot be determined by plain javascript
    static experimentType = "STS";
    static shape = "rectangle"; // rectangle or circle
    static intDevice = "mouse".toLowerCase(); // Mouse, Touch
    static trialsPerBreak = NaN;
    static generalUsername = "none"; // Will be displayed in dataset when no username was entered
    static version = "4.0";

    // Block Config
    static allowSwipe = false; // Determines if it is allowed to swipe e.g. from down outside to up in target
    static randomTrialPlacement = true; // Determines if the trials will be placed random on the canvas or in the middle
    static randomTrialPlacementTolerance = 20 // Determines how much the element has to be away from the borders
    static startSize = 10; // Size of the start block (always AxA)
    static numBlocks = 3;
    // Category, targetWidth, targetHeight, Amplitude, trialDirection
    // up, up-right, right-up, right, right-down, down-right, down, down-left,
    // left-down, left, left-up, up-left
    // Circle: width => height
    static trialsDataCategories = [
        ["C1", 10, 10, 40, 'up'],
        ["C2", 20, 10, 30, 'up-right'],
        ["C3", 20, 15, 25, 'right-up'],
        ["C4", 25, 10, 30, 'right'],
        ["C5", 10, 20, 25, 'right-down'],
        ["C6", 20, 10, 30, 'down-right'],
        ["C7", 30, 15, 30, 'down'],
        ["C8", 15, 20, 25, 'down-left'],
        ["C9", 20, 15, 30, 'up-right'],
        ["C10", 20, 10, 30, 'left-down'],
        ["C11", 10, 20, 35, 'left'],
        ["C12", 20, 10, 25, 'left-up'],
        ["C13", 10, 20, 40, 'up-left'],
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

    // Determines clickTolerance (in px) where click is counted as miss
    static clickTolerance(amplitude) {
        return mm2px(amplitude / 2);
    }
}