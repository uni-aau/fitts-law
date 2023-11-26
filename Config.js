class Config {
    static isDebug = false;
    static serverRequestLink = 'http://david.jamnig.net/tests/fittslaw/server/update.php';
    static sendDataToServer = false;
    // Calculation - Fullscreen -> Get windowInnerWidth/Height as resolution and inch of screen. Then calculate the ppi
    static ppi = 137.61; // Cannot be determined by plain javascript
    static experimentType = "STS";
    static shape = "rectangle"; // rectangle or circle
    static intDevice = "mouse".toLowerCase(); // Mouse, Touch
    static trialsPerBreak = 20;
    static generalUsername = "none"; // Will be displayed in dataset when no username was entered
    static version = "4.1";

    // Block Config
    static allowSwipe = true; // Determines if it is allowed to swipe e.g. from down outside to up in target
    static randomTrialPlacement = true; // Determines if the trials will be placed random on the canvas or in the middle
    static randomTrialPlacementTolerance = 20 // Determines how much the element has to be away from the borders
    static startSize = 10; // Size of the start block (always AxA)
    static numBlocks = 3;
    // Category, targetWidth, targetHeight, Amplitude, trialDirection
    // e.g. up -> target is above start element
    // Circle: width => height
    static trialsDataCategories = [
        // ["C1", 20, 10, 50, 'up']
        ["C1", 20, 10, 50, 'up'], // 90
        ["C2", 20, 10, 50, 'down'], // 270
        ["C3", 10, 5, 30, 'right'], // 180
        ["C4", 10, 5, 30, 'left'], // 360
        ["C5", 5, 5, 20, 'up-right-135'],
        ["C6", 5, 5, 20, 'down-left-315'],
        ["C1", 20, 10, 50, 'up'], // 90
        ["C2", 20, 10, 50, 'down'], // 270
        ["C3", 10, 5, 30, 'right'], // 180
        ["C4", 10, 5, 30, 'left'], // 360
        ["C5", 5, 5, 20, 'up-right-135'],
        ["C6", 5, 5, 20, 'down-left-315'],
    ];

    // Predefined Clock: 12 (up), 1 (up-right), 2 (right-up), 3...
    // Can be extended
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
        'up-right-135': 135,
        'down-left-315': 315,
    };
    static isMissSkipped = true; // True - Miss click will be skipped / False - Nothing will be skipped
    static reAddClicksInTolerance = true; // Readds misses that were in tolerance within the same block in a random position
    static reAddClicksDownOutsideUpTarget = true; // Readds clicks where touch down was outside the tolerance and touchup was in target
    static elementStrokeStyle = "black"; // object border color
    static startElementFillStyle = "rgba(144, 238, 144, 1.0)";
    static targetElementFillStyle = ["rgba(120,120,120,1.0)"] // Allows also selection of random colors by providing more than one rgba color
    static targetElementSelectionStyle = "rgba(0, 0, 139, 1.0)"; // Dark blue color

    // Determines clickTolerance (in px) where click is counted as miss
    static clickTolerance(amplitude) {
        return mm2px(amplitude / 2);
    }
}