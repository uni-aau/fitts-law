class Config {
    static experimentType = "STS";
    static shape = "rectangle"; // rectangle or circle
    static intDevice = "Mouse"; // Mouse, Touch, Laser Pointer
    static startSize = 10;
    static numBlocks = 1;
    static numRects = 4;

    static trialsPerBreak = 3;

    // Block Config
    static targetHeight = [4, 8, 10, 15, 6, 8, 10, 12, 16, 20, 15, 20, 25, 4, 4, 4, 8, 8, 8, 10, 10, 10];
    static targetWidth = [4, 8, 10, 15, 4, 4, 4, 8, 8, 8, 10, 10, 10, 6, 8, 10, 12, 16, 20, 15, 20, 25];
    static amplitude = [33, 50];
    static trialDirection = ['Left', 'Up', 'Right', 'Down']; //  Direction of the required interaction
}