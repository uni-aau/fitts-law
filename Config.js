class Config {
    static experimentType = "STS";
    static shape = "rectangle"; // rectangle or circle
    static intDevice = "Mouse"; // Mouse, Touch, Laser Pointer
    static startSize = 10; // Size of the start block (always AxA)
    static numBlocks = 3;
    static numRects = 4; // TODO marked for removal

    static trialsPerBreak = NaN;

    // Block Config
    // TODO marked for removal
    // static targetHeight = [4, 8, 10, 15, 6, 8, 10, 12, 16, 20, 15, 20, 25, 4, 4, 4, 8, 8, 8, 10, 10, 10];
    // static targetWidth = [4, 8, 10, 15, 4, 4, 4, 8, 8, 8, 10, 10, 10, 6, 8, 10, 12, 16, 20, 15, 20, 25];
    // static amplitude = [33, 50];
    static targetHeight = [4]
    static targetWidth = [10]
    static amplitude = [20]
    static trialDirection = ['Left', 'Up', 'Right', 'Down']; //  Direction of the required interaction

    static clickTolerance(amplitude) {
        return mm2px(amplitude / 2);
    }

    static isMissSkipped = true; // True - Miss click will be skipped / False - Nothing will be skipped
    static reAddMisses = true; // Readds misses within the same block in a random position


    static generalUsername = "none";
    static elementStrokeStyle = "black";
    static startElementFillStyle = "rgba(144, 238, 144, 0.8)";
    static targetElementFillStyle = "rgba(255, 102, 102, 0.8)";
    static targetElementSelectionStyle = "rgba(0, 0, 139, 0.8)"; // Dark blue color


    // Category, targetWidth, targetHeight, Amplitude, trialDirection
    // up, up-right, right-up, right, right-down, down-right, down, down-left,
    // left-down, left, left-up, up-left
    static trialsDataCategories = [
        ["C1", 10, 4, 30, 'Up'],
        ["C2", 10, 2, 20, 'up-left'],
        ["C3", 10, 2, 20, 'left-down'],
        ["C4", 10, 2, 20, 'left'],
    ];
}