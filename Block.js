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
                trialDataCategory[3] // amplitude
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
        return this.totalTrialsAmount;
    }

    // readds trial to block and shuffles array (e.g if trial was wrongly clicked)
    reAddTrial(trialNumber) {
        const trial = this.trials[trialNumber - 1];
        this.totalTrialsAmount++;
        this.trials.push(trial);
        this.shuffleArray(this.trials)
    }


    //check if the block has another trial
    hasNext(trialNumber) {
        return this.totalTrialsAmount - trialNumber > 0;
    }

    getStartTrialSize() {
        return this.startTrialsAmount
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



