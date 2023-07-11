class Block {
    constructor(blockNumber, experimentType, shape, intDevice, rectsize, startSize, numRects) {
        this.shape = shape;
        this.targetHeight = [4, 8, 10, 15, 6, 8, 10, 12, 16, 20, 15, 20, 25, 4, 4, 4, 8, 8, 8, 10, 10, 10];
        this.targetWidth = [4, 8, 10, 15, 4, 4, 4, 8, 8, 8, 10, 10, 10, 6, 8, 10, 12, 16, 20, 15, 20, 25];
        this.amplitude = [33, 50];
        this.trialDirection = ['Left', 'Up', 'Right', 'Down']; //  Direction of the required interaction
        this.intDevice = intDevice;
        this.blockNumber = blockNumber;
        this.experimentType = experimentType;
        this.startSize = startSize;
        this.numRects = numRects;
        this.rectsize = rectsize;
        this.trialId = 1; // Initialize the trial ID

        this.currentstartIndex = null;
        this.currentTargetIndex = null;
        this.trialsNum = this.targetWidth.length * this.trialDirection.length * this.amplitude.length;
        this.usedIndices = [];
        this.rectIndices = [];
        for (let i = 0; i < this.numRects; i++) {
            this.rectIndices.push(i);
        }

        // Initialize an empty array to store the trials
        this.trials = [];

        // Nested loops to generate the trials
        for (var i = 0; i < this.targetWidth.length; i++) { // loop to go through target width
            for (var k = 0; k < this.amplitude.length; k++) { // loop to go through Amplitude
                for (var j = 0; j < this.trialDirection.length; j++) { // loop to go through interaction direction

                    // check and assign startIndex, and TargetIndex for each direction
                    if (this.trialDirection[j] == 'Up') {
                        this.startIndex = 1;
                        this.targetIndex = 3;
                    }
                    if (this.trialDirection[j] == 'Down') {
                        this.startIndex = 3;
                        this.targetIndex = 1;
                    }
                    if (this.trialDirection[j] == 'Right') {
                        this.startIndex = 2;
                        this.targetIndex = 0;
                    }
                    if (this.trialDirection[j] == 'Left') {
                        this.startIndex = 0;
                        this.targetIndex = 2;
                    }

                    // Create a trial object with the current combination of values
                    const trial = new Trial(
                        this.trialId,
                        this.shape,
                        this.trialDirection[j],
                        this.intDevice,
                        this.startIndex,
                        this.targetIndex,
                        this.startSize,
                        this.targetWidth[i],
                        this.targetHeight[i],
                        this.amplitude[k]
                    );

                    // Add the trial object to the trials array
                    this.trials.push(trial);
                    this.trialId++; // Increment the trial number
                }
            }
        }
        // Shuffle the trials array randomly
        this.shuffleArray(this.trials);
    }

// return trial
    getTrial(trialNumber) {
        return this.trials[trialNumber - 1];
    }

    //check if the block has another trial
    hasNext(trialNumber) {
        return this.trialsNum - trialNumber > 0;
    }

// Shuffling function using Fisher-Yates algorithm
    shuffleArray(array) {
        var currentIndex = array.length;
        var temporaryValue, randomIndex;

        // While there remain elements to shuffle
        while (currentIndex !== 0) {

            // Pick a remaining element
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // Swap it with the current element
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

}





