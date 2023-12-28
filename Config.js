class Config {
    static isDebug = false;
    static serverRequestLink = 'http://david.jamnig.net/tests/fittslaw/server/update.php';
    static sendDataToServer = false;
    // Calculation - Fullscreen -> Get windowInnerWidth/Height as resolution and inch of screen. Then calculate the ppi
    static ppi = 155.61; // Cannot be determined by plain javascript
    static shape = "rectangle"; // rectangle or circle
    static intDevice = "mouse".toLowerCase(); // Mouse, Touch
    static trialsPerBreak = NaN;
    static generalUsername = "none"; // Will be displayed in dataset when no username was entered
    static version = "5.0";

    // Block Config
    static randomTrialPlacement = true; // Determines if the trials will be placed random on the canvas or in the middle
    static randomTrialPlacementTolerance = 20 // Determines how much the element has to be away from the borders
    static startSize = 10; // Size of the start block (always AxA)
    static numBlocks = 3;
    // Category, targetWidth, targetHeight, Amplitude, trialDirection
    // e.g. up -> target is above start element
    // Circle: width => height
    static trialsDataCategories = [
        ["C1", 5, 8, 20, 'left'],
        ["C2", 10, 6, 20, 'left'],
        ["C3", 4, 8, 20, 'left'],
        ["C4", 9, 10, 20, 'left'],
        ["C5", 10, 5, 20, 'left'],
        ["C6", 8, 16, 20, 'left'],
        ["C7", 12, 4, 20, 'left'],
        ["C8", 5, 3, 20, 'left'],
        ["C9", 10, 3, 35, 'left'],
        ["C10", 3, 11, 35, 'left'],
        ["C11", 7, 17, 35, 'left'],
        ["C12", 2, 6, 35, 'left'],
        ["C13", 15, 5, 35, 'left'],
        ["C14", 2, 9, 35, 'left'],
        ["C15", 18, 4, 35, 'left'],
        ["C16", 14, 3, 35, 'left'],

        ["C1", 5, 8, 20, 'right'],
        ["C2", 10, 6, 20, 'right'],
        ["C3", 4, 8, 20, 'right'],
        ["C4", 9, 10, 20, 'right'],
        ["C5", 10, 5, 20, 'right'],
        ["C6", 8, 16, 20, 'right'],
        ["C7", 12, 4, 20, 'right'],
        ["C8", 5, 3, 20, 'right'],
        ["C9", 10, 3, 35, 'right'],
        ["C10", 3, 11, 35, 'right'],
        ["C11", 7, 17, 35, 'right'],
        ["C12", 2, 6, 35, 'right'],
        ["C13", 15, 5, 35, 'right'],
        ["C14", 2, 9, 35, 'right'],
        ["C15", 18, 4, 35, 'right'],
        ["C16", 14, 3, 35, 'right'],


        ["C1", 5, 8, 20, 'up'],
        ["C2", 10, 6, 20, 'up'],
        ["C3", 4, 8, 20, 'up'],
        ["C4", 9, 10, 20, 'up'],
        ["C5", 10, 5, 20, 'up'],
        ["C6", 8, 16, 20, 'up'],
        ["C7", 12, 4, 20, 'up'],
        ["C8", 5, 3, 20, 'up'],
        ["C9", 10, 3, 35, 'up'],
        ["C10", 3, 11, 35, 'up'],
        ["C11", 7, 17, 35, 'up'],
        ["C12", 2, 6, 35, 'up'],
        ["C13", 15, 5, 35, 'up'],
        ["C14", 2, 9, 35, 'up'],
        ["C15", 18, 4, 35, 'up'],
        ["C16", 14, 3, 35, 'up'],


        ["C1", 5, 8, 20, 'down'],
        ["C2", 10, 6, 20, 'down'],
        ["C3", 4, 8, 20, 'down'],
        ["C4", 9, 10, 20, 'down'],
        ["C5", 10, 5, 20, 'down'],
        ["C6", 8, 16, 20, 'down'],
        ["C7", 12, 4, 20, 'down'],
        ["C8", 5, 3, 20, 'down'],
        ["C9", 10, 3, 35, 'down'],
        ["C10", 3, 11, 35, 'down'],
        ["C11", 7, 17, 35, 'down'],
        ["C12", 2, 6, 35, 'down'],
        ["C13", 15, 5, 35, 'down'],
        ["C14", 2, 9, 35, 'down'],
        ["C15", 18, 4, 35, 'down'],
        ["C16", 14, 3, 35, 'down'],
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

    static repeatTrial = true; // Determine, if Trial gets repeated due to fail
    static elementStrokeStyle = "black"; // object border color
    static startElementFillStyle = "rgba(144, 238, 144, 1.0)";
    static targetElementFillStyle = ["rgba(120,120,120,1.0)"] // Allows also selection of random colors by providing more than one rgba color
    static targetElementSelectionStyle = "rgba(0, 0, 139, 1.0)"; // Dark blue color
    static displayMiddlePointOfElement = false;

    // Determines clickTolerance (in px) where click is counted as miss
    static clickTolerance(amplitude) {
        return mm2px(amplitude / 2);
    }
}