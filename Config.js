class Config {
    // Determines location where the update script is stored on server (only needed when sendDataToServer is true)
    static serverRequestLink = 'http://david.jamnig.net/tests/fittslaw/server/update.php';
    static sendDataToServer = false;

    // Calculation - Fullscreen -> Get windowInnerWidth/Height as resolution and inch of screen. Then calculate the ppi
    // PPI cannot be determined by plain javascript
    static ppi = 155.61;       // Determines proper size of elements (so that 1cm equals 1cm on every phone
    static shape = "rectangle"; // rectangle or circle (circle not adjusted)
    static intDevice = "mouse".toLowerCase(); // Mouse, Touch (when touch enabled, mouseclick will not work)
    static trialsPerBreak = NaN;
    static generalUsername = "none"; // Will be displayed in dataset when no username was entered
    static version = "8.0";

    // Trial Config
    static isTestSet = false;                           // Determines, if test or trainings set will be used for trials
    static numBlocksTestSet = 3;                        // Amount of blocks for test set
    static numBlocksTrainingsSet = 1;                   // Amount of blocks for trainings set
    static shuffleTrialsInBlock = true;                 // Determines, if Trials should be shuffled (random position) in the current block
    static startSize = 10;                              // Size of the start element (always AxA)
    static repeatTrial = true;                          // Determines, if Trial needs to be repeated in current block due to fail
    static elementStrokeStyle = "black";                  // Element border color
    static startElementFillStyle = "rgba(144, 238, 144, 1.0)";
    static targetElementFillStyle = ["rgba(120,120,120,1.0)"]       // Also allows selection of random colors by providing more than one rgba color
    static targetElementSelectionStyle = "rgba(0, 0, 139, 1.0)";     // Dark blue color

    // Trial Config - Random Placement (in mm)
    static randomTrialPlacement = true;                // Determines if the trials will be placed on random positions of the canvas or in the middle
    static randomTrialPlacementToleranceXLeft = 3;     // Determines how much the element has to be away from the left canvas width (X) border
    static randomTrialPlacementToleranceXRight = 3;    // Determines how much the element has to be away from the right canvas width (X) border
    static randomTrialPlacementToleranceYUp = 3;       // Determines how much the element has to be away from the up canvas height (Y) border
    static randomTrialPlacementToleranceYDown = 3;     // Determines how much the element has to be away from the down canvas height (Y) border

    // Debug Flags
    static isDebug = false;                         // Enables more detailed logging
    static displayMiddlePointOfElement = false;     // Enables debug displaying of middle point of the elements
    static drawCanvasGrid = false;                  // Draws a grid all over the canvas for accurate debugging
    static drawToleranceElement = false;            // Draws the Tolerance element
    static showStartWindow = true;                 // Toggles display of start window

    // Circle: height gets automatically replaced with width
    // Category, targetWidth, targetHeight, Amplitude, trialDirection (e.g. up -> target is above start element)
    // Note: When adding the same Trial Category, the Trials will be treated as the same
    // (e.g. when the first trial got a miss, the counter will be also incremented for the other trial)
    static trialsDataCategoriesTestSet = [
        ["C1", 20, 5, 40, 'left'],
        ["C2", 12, 6, 40, 'left'],
        ["C3", 20, 5, 40, 'left'],
        ["C4", 6, 12, 40, 'left'],
        ["C5", 8, 8, 40, 'left'],
        ["C6", 24, 8, 31, 'up'],
        ["C7", 18, 9, 31, 'up'],
        ["C8", 8, 24, 31, 'up'],
        ["C9", 9, 18, 31, 'up'],
        ["C10", 12, 12, 31, 'up'],
        ["C11", 30, 10, 43, 'up-left'],
        ["C12", 20, 12, 43, 'up-left'],
        ["C13", 10, 30, 43, 'up-left'],
        ["C14", 12, 20, 43, 'up-left'],
        ["C15", 15, 15, 43, 'up-left'],
        ["C16", 28, 4, 39, 'up-right'],
        ["C17", 7, 7, 39, 'up-right'],
        ["C18", 3, 6, 60, 'left-up'],
        ["C19", 4, 4, 60, 'left-up'],
        ["C20", 13, 17, 38, 'left-up'],
        ["C21", 12, 4, 47, 'right-up'],
        ["C22", 6, 6, 47, 'right-up'],
        ["C23", 6, 18, 34, 'right-up'],
        ["C24", 9, 9, 34, 'right-up'],
        ["C25", 4, 7, 55, 'right-up'],
        ["C26", 30, 15, 50, 'up-right'],
        ["C27", 20, 20, 50, 'up-right'],
        ["C28", 10, 4, 58, 'left-up'],
        ["C29", 17, 3, 22, 'up-right'],
        ["C30", 15, 10, 37, 'left-up'],
        ["C31", 20, 5, 40, 'right'],
        ["C32", 12, 6, 40, 'right'],
        ["C33", 20, 5, 40, 'right'],
        ["C34", 6, 12, 40, 'right'],
        ["C35", 8, 8, 40, 'right'],
        ["C36", 24, 8, 31, 'down'],
        ["C37", 18, 9, 31, 'down'],
        ["C38", 8, 24, 31, 'down'],
        ["C39", 9, 18, 31, 'down'],
        ["C40", 12, 12, 31, 'down'],
        ["C41", 30, 10, 43, 'down-right'],
        ["C42", 20, 12, 43, 'down-right'],
        ["C43", 10, 30, 43, 'down-right'],
        ["C44", 12, 20, 43, 'down-right'],
        ["C45", 15, 15, 43, 'down-right'],
        ["C46", 28, 4, 39, 'down-left'],
        ["C47", 7, 7, 39, 'down-left'],
        ["C48", 3, 6, 60, 'right-down'],
        ["C49", 4, 4, 60, 'right-down'],
        ["C50", 13, 17, 38, 'right-down'],
        ["C51", 12, 4, 47, 'left-down'],
        ["C52", 6, 6, 47, 'left-down'],
        ["C53", 6, 18, 34, 'left-down'],
        ["C54", 9, 9, 34, 'left-down'],
        ["C55", 4, 7, 55, 'left-down'],
        ["C56", 30, 15, 50, 'down-left'],
        ["C57", 20, 20, 50, 'down-left'],
        ["C58", 10, 4, 58, 'right-down'],
        ["C59", 17, 3, 22, 'down-left'],
        ["C60", 15, 10, 37, 'right-down']
    ];

    static trialsDataCategoriesTrainingsSet = [
        ["C1", 8, 8, 40, 'left'],
        ["C2", 9, 18, 31, 'up'],
        ["C3", 20, 12, 43, 'up-left'],
        ["C4", 6, 18, 34, 'right-up'],
        ["C5", 30, 15, 50, 'up-right'],
        // ["C6", 10, 4, 58, 'left-up'],
        ["C7", 6, 12, 40, 'right'],
        ["C8", 18, 9, 31, 'down'],
        ["C9", 10, 30, 43, 'down-right'],
        ["C10", 28, 4, 39, 'down-left'],
        ["C11", 6, 6, 47, 'left-down'],
        // ["C12", 10, 4, 58, 'right-down']
    ];

    // Predefined Clock: 12 (up), 1 (up-right), 2 (right-up), 3 (right), 4 ...
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
    };

    // Determines clickTolerance (in px) where click is not in target and not outside (marked as Tolerance Click)
    static clickTolerance(amplitude) {
        return mm2px((amplitude / 2));
    }

}