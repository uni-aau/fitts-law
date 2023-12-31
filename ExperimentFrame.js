class ExperimentFrame {

    constructor() {
        this.blockNumber = 1;
        this.trialNumber = 0;
        this.trialNumberWithoutReAddtion = 0;
        this.serialNumber = 1;
        this.totalFinishedTrialsAmount = 0;
        this.totalFinishedTrialsAmountWithoutReAddition = 0;
        this.experiment = new Experiment();
        this.totalBlocks = this.experiment.getNumBlocks(); // Track the total number of blocks
        // Set the number of trials per break
        this.trialsPerBreak = Config.trialsPerBreak;
        this.dataRecorder = new DataRecorder();
    }

    initializeExperiment() {
        this.username = document.getElementById("name_input").value;
        if (this.username === "") {
            if (Config.isDebug) console.log("No username inserted - Using general username");
            this.username = Config.generalUsername;
        }
        if (Config.trialsDataCategories.length > 0) this.showTrial();
        else console.error("No Trial Data Categories defined in Config!");
    }

    // Show only the target and start rectangles on the screen
    showTrial() {
        this.totalFinishedTrialsAmount++;
        this.trialNumber++;
        this.currentBlock = this.experiment.getBlock(this.blockNumber);
        if (Config.isDebug) this.currentBlock.printTrials();
        const currentTrial = this.currentBlock.getTrial(this.trialNumber);

        const STTrialsHandling = new STTrialHandling(currentTrial, this.currentBlock, this.trialNumber, this.serialNumber, this.dataRecorder, this.username, (getsReAdded) => {
            this.trialCompleted(getsReAdded);
            STTrialsHandling.removeEventListeners();
        });

        this.displayTextValues();
        STTrialsHandling.showTrial();

        // Check if it's time for a break
        if ((this.totalFinishedTrialsAmountWithoutReAddition + 1) % this.trialsPerBreak === 0) { // only determine break of correct trials
            // Display the break window
            this.displayBreakWindow();
        }
    }

    // Function to display the break window
    displayBreakWindow() {
        const breakWindow = document.getElementById('breakWindow'); // Get the break window modal
        breakWindow.style.display = 'block'; // Show the modal

        // Disable the rest of the page interaction while the break window is visible
        document.body.style.pointerEvents = 'none';

        const continueButton = document.getElementById('continueButton');

        // Event listener for the continue button
        continueButton.addEventListener('click', () => {
            breakWindow.style.display = 'none'; // Hide the break window modal
            document.body.style.pointerEvents = 'auto'; // Enable the page interaction again
        });
    }

    // Function to display the finish window
    displayFinishWindow() {
        const finishWindow = document.getElementById('finishWindow');
        finishWindow.style.display = 'block'; //show modal
        // Disable the rest of the page interaction while the break window is visible
        document.body.style.pointerEvents = 'none';

        const downloadDataButton = document.getElementById('downloadDataButton');

        // Event listener for the finish button
        downloadDataButton.addEventListener('click', () => {
            this.dataRecorder.generateCsvDownloadLink(true);
            location.reload();
        });
    }

    trialCompleted(getsReAdded) {
        const currentBlock = this.experiment.getBlock(this.blockNumber);
        this.serialNumber++;

        if (getsReAdded) {
            if (Config.isDebug) console.log("Readding trial: " + this.trialNumber + " | " + this.currentBlock.getTrial(this.trialNumber).trialCategory)
            this.currentBlock.reAddTrial(this.trialNumber);
        } else {
            this.trialNumberWithoutReAddtion++;
            this.totalFinishedTrialsAmountWithoutReAddition++;
        }

        if (currentBlock) {
            if (currentBlock.hasNext(this.trialNumber)) {
                this.getNextTrial();
            } else if (this.experiment.hasNext(this.blockNumber)) {
                this.getNextBlock();
            } else {
                // Last trial and block completed
                this.experimentFinished();
            }
        } else {
            console.error("Invalid block number: " + this.blockNumber);
        }
    }

    getNextTrial() {
        this.showTrial();
    }

    getNextBlock() {
        this.blockNumber++;
        this.trialNumber = 0;
        this.trialNumberWithoutReAddtion = 0;
        this.showTrial();
    }

    displayTextValues() {
        const currentTrialIndexEl = document.getElementById("finishedTrialsInBlock");
        // currentTrialIndexEl.textContent = this.trialNumber;
        currentTrialIndexEl.textContent = this.trialNumberWithoutReAddtion;

        const totalCurrentTrialIndexEl = document.getElementById("totalFinishedTrials");
        // totalCurrentTrialIndexEl.textContent = this.totalFinishedTrialsAmount;
        totalCurrentTrialIndexEl.textContent = this.totalFinishedTrialsAmountWithoutReAddition;

        const totalTrialIndexPerBlockEl = document.getElementById("totalTrialsInBlock");
        totalTrialIndexPerBlockEl.textContent = this.getTotalTrialsStartAmountPerBlock();

        const totalTrialIndexEl = document.getElementById("totalTrialsAmount");
        totalTrialIndexEl.textContent = this.getTotalTrialsStartAmount().toString()

        const currentBlockIndexEl = document.getElementById("currentBlockNumber");
        currentBlockIndexEl.textContent = this.blockNumber;

        const totalBlockIndexEl = document.getElementById("totalBlocksAmount");
        totalBlockIndexEl.textContent = Config.numBlocks.toString();

        const trialsToBlockIndexEl = document.getElementById("breakCount");
        trialsToBlockIndexEl.textContent = this.getRemainingTrials();

        const versionElement = document.getElementById("versionNumber");
        const widthText = document.getElementById("widthText");
        const heightText = document.getElementById("heightText");
        versionElement.textContent = Config.version;
        widthText.textContent = getWindowInnerWidth().toString();
        heightText.textContent = getWindowInnerHeight().toString();
    }

    experimentFinished() {
        // Check if it's the last block
        const isLastBlock = this.blockNumber === this.totalBlocks;

        if (isLastBlock) {
            console.log("Successfully finished experiment!")
            this.displayFinishWindow()
        }
    }

    getTotalTrials() {
        let totalTrials = 0;
        for (let i = 0; i < this.experiment.getNumBlocks(); i++) {
            const block = this.experiment.getBlock(i + 1);
            totalTrials += block.totalTrialsAmount;
        }
        return totalTrials;
    }

    getTotalTrialsStartAmount() {
        let totalTrials = 0;
        for (let i = 0; i < this.experiment.getNumBlocks(); i++) {
            const block = this.experiment.getBlock(i + 1);
            totalTrials += block.startTrialsAmount;
        }
        return totalTrials;
    }

    getTotalTrialsPerBlock() {
        return this.currentBlock.getTrialsAmount();
    }

    getTotalTrialsStartAmountPerBlock() {
        return this.currentBlock.getStartTrialsAmount();
    }

    getRemainingTrials() {
        // return this.trialsPerBreak - (this.trialNumber % this.trialsPerBreak); TODO
        return this.trialsPerBreak - ((this.totalFinishedTrialsAmountWithoutReAddition + 1) % this.trialsPerBreak);
    }
}
