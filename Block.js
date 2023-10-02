class Block {
    constructor(blockNumber, experimentType, shape, intDevice, startSize) {
        this.shape = shape;
        this.trialDataCategories = Config.trialsDataCategories;

        this.intDevice = intDevice;
        this.blockNumber = blockNumber;
        this.experimentType = experimentType;
        this.startSize = startSize;
        this.trialId = 1; // Initialize the trial ID

        // this.trialsNum = this.targetWidth.length * this.trialDirection.length * this.amplitude.length;
        this.trialsNum = this.trialDataCategories.length; // todo rename as below
        this.startTrialsSize = this.trialsNum

        // Initialize an empty array to store the trials
        this.trials = [];

        for(let i = 0; i < this.trialDataCategories.length; i++) {
            const trialDirection = this.trialDataCategories[i][4].toLowerCase();

            if(trialDirection in Config.clockDirections) {
                this.trialClockAngle = Config.clockDirections[trialDirection];
            } else {
                console.error("No trialDirection in data array with name " + trialDirection)
            }

            // Create a trial object with the current combination of values
            const trial = new Trial(
                this.trialId,
                this.trialDataCategories[i][0],
                this.shape,
                trialDirection,
                this.trialClockAngle,
                this.intDevice,
                this.startSize,
                this.trialDataCategories[i][1], // width
                this.trialDataCategories[i][2], // height
                this.trialDataCategories[i][3] // amplitude
            );

            // Add the trial object to the trials array
            this.trials.push(trial);
            this.trialId++; // Increment the trial number

        }
        // Shuffle the trials array randomly
        this.shuffleArray(this.trials);
    }

// return trial
    getTrial(trialNumber) {
        return this.trials[trialNumber - 1];
    }

    getTrialsAmount() {
        return this.trialsNum;
    }

    // readds trial to block and shuffles array (e.g if trial was wrongly clicked)
    reAddTrial(trialNumber) {
        const trial = this.trials[trialNumber - 1];
        this.trialsNum++;
        this.trials.push(trial);
        this.shuffleArray(this.trials)
    }


    //check if the block has another trial
    hasNext(trialNumber) {
        return this.trialsNum - trialNumber > 0;
    }

    getStartTrialSize() {
        return this.startTrialsSize
    }
// Shuffling function using Fisher-Yates algorithm
    shuffleArray(array) {
        let currentIndex = array.length;
        let temporaryValue, randomIndex;

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

// Todo bei jedem block anders anordnen? Testen!



/* Old (random creation)
 // Nested loops to generate the trials
        for (let i = 0; i < this.targetWidth.length; i++) { // loop to go through target width
            for (let k = 0; k < this.amplitude.length; k++) { // loop to go through Amplitude
                for (let j = 0; j < this.trialDirection.length; j++) { // loop to go through interaction direction

                    // check and assign startIndex, and TargetIndex for each direction
                    if (this.trialDirection[j] === 'Up') {
                        this.startIndex = 1;
                        this.targetIndex = 3;
                    }
                    if (this.trialDirection[j] === 'Down') {
                        this.startIndex = 3;
                        this.targetIndex = 1;
                    }
                    if (this.trialDirection[j] === 'Right') {
                        this.startIndex = 2;
                        this.targetIndex = 0;
                    }
                    if (this.trialDirection[j] === 'Left') {
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
 */





