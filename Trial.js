class Trial {
    constructor(trialId, trialCategory, shape, trialDirection, trialClockAngle, intDevice, startIndex, targetIndex, startSize, targetWidth, targetHeight, amplitude) {
        this.trialId = trialId;                             // gives ID for each trial so that it can be tracked after shuffle
        this.trialCategory = trialCategory                  // shows the trial category string
        this.shape = shape;                                 // shows which shape will be used in the experiment e.g. "Rectangle" , "Circle"
        this.trialDirection = trialDirection;               // shows interaction direction e.g. "UP", "Down" , "Right" , "Left"
        this.trialClockAngle = trialClockAngle;             // Determines the angle of the target object
        this.intDevice = intDevice;                         // shows the device used during the experiment "Mouse" , "Touch"  , "Laser Pointer"
        this.startIndex = startIndex; // TODO marked for removal
        this.targetIndex = targetIndex; // TODO marked for removal
        this.amplitude = amplitude;
        this.targetWidth = targetWidth;
        this.targetHeight = targetHeight;
        this.startSize = startSize;
    }
}