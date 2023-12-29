class Block {
    constructor(blockNumber, shape, startSize) {
        this.shape = shape;
        this.trialDataCategories = Config.trialsDataCategories;
        this.blockNumber = blockNumber;
        this.startSize = startSize;
        this.trialId = 1; // Initialize the trial ID

        this.totalTrialsAmount = this.trialDataCategories.length;
        this.startTrialsAmount = this.totalTrialsAmount

        // Initialize an empty array to store the trials
        this.trials = [];

        this.createTrials();
    }

    createTrials() {
        for (const trialDataCategory of this.trialDataCategories) {
            const trialDirection = trialDataCategory[4].toLowerCase();

            if (trialDirection in Config.clockDirections) {
                this.trialClockAngle = Config.clockDirections[trialDirection];
            } else {
                console.error("No trialDirection in data array with name " + trialDirection)
            }

            // Create a trial object with the current combination of values
            const trial = new Trial(
                this.trialId,
                trialDataCategory[0],
                this.shape,
                trialDirection,
                this.trialClockAngle,
                this.startSize,
                trialDataCategory[1], // width
                trialDataCategory[2], // height
                trialDataCategory[3], // amplitude
                0
            );

            // Add the trial object to the trials array
            this.trials.push(trial);
            this.trialId++; // Increment the trial number

        }
        // Shuffle the trials array randomly
        if (Config.shuffleTrialsInBlock) this.shuffleArray(this.trials, 0);
    }

    // return trial
    getTrial(trialNumber) {
        return this.trials[trialNumber - 1];
    }

    printTrials() {
        console.log(this.trials);
    }

    getTrialsAmount() {
        return this.totalTrialsAmount;
    }

    // Readds trial to block and shuffles array (e.g if trial was wrongly clicked)
    reAddTrial(trialNumber) {
        const reAddedTrial = this.trials[trialNumber - 1];

        // Increment repetition amount of all trials that have the same ID
        for (let i = trialNumber; i < this.trials.length; i++) {
            if (this.trials[i].trialCategory === reAddedTrial.trialCategory) {
                if (Config.isDebug) console.log("Incrementing trial with id " + this.trials[i].trialId);
                this.trials[i].repetitions++;
            }
        }

        reAddedTrial.repetitions++;
        this.totalTrialsAmount++;
        this.trials.push(reAddedTrial);
        if (Config.shuffleTrialsInBlock) this.shuffleArray(this.trials, trialNumber)     // Shuffles only array entries after the last wrongly clicked trial
    }


    // Check if the block has another trial
    hasNext(trialNumber) {
        return this.totalTrialsAmount - trialNumber > 0;
    }

    getStartTrialsAmount() {
        return this.startTrialsAmount
    }

    // Shuffling array using Fisher-Yates algorithm
    // Starting at a specific position
    shuffleArray(array, startIndex = 0) {
        for (let currentIndex = startIndex; currentIndex < array.length; currentIndex++) {
            let randomIndex = startIndex + (Math.floor(Math.random() * (array.length - startIndex)));
            let tempValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = tempValue;
        }
        return array;
    }

    getBlockNumber() {
        return this.blockNumber;
    }

}



