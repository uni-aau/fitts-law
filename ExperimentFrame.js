class ExperimentFrame {

    constructor() {
        this.blockNumber = 1;
        this.trialNumber = 1;
        this.totalFinishedTrialsAmount = 0;
        this.experiment = new Experiment();
        this.totalBlocks = this.experiment.getNumBlocks(); // Track the total number of blocks
        // Set the number of trials per break
        this.trialsPerBreak = Config.trialsPerBreak;
        this.dataRecorder = new DataRecorder();
    }

    initializeExperiment() {
        this.username = document.getElementById("name_input").value;
        if (this.username === "") {
            console.log("No username inserted - Using general username");
            this.username = Config.generalUsername;
        }
        this.showTrial();
    }

    // Show only the target and start rectangles on the screen
    showTrial() {
        this.totalFinishedTrialsAmount++;
        this.currentBlock = this.experiment.getBlock(this.blockNumber);
        const currentTrial = this.currentBlock.getTrial(this.trialNumber);

        if (!this.printedFirstBlock) {
            this.printedFirstBlock = true;
            this.printAllTrials();
        }

        const STRectDrawing = new STRectsDrawing(currentTrial, this.currentBlock, this.blockNumber, this.trialNumber, this.dataRecorder, this.username, () => {
            this.trialCompleted();
        });

        this.showIndexes();
        STRectDrawing.showRects();

        // Check if it's time for a break
        if (this.trialNumber % this.trialsPerBreak === 0) {
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

        const downloadDataButton = document.getElementById('downloadData');

        // Event listener for the finish button
        downloadDataButton.addEventListener('click', () => {
            this.dataRecorder.generateCsvDownloadLink(true);
            location.reload();
        });
    }

    trialCompleted() {
        const currentBlock = this.experiment.getBlock(this.blockNumber);

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
            console.error("Invalid block number:", this.blockNumber);
        }
    }

    getNextTrial() {
        this.trialNumber++;
        this.showTrial();
    }

    getNextBlock() {
        this.blockNumber++;
        this.trialNumber = 1;
        this.showTrial();
    }

    showIndexes() {
        const currentTrialIndexEl = document.getElementById("currentTrialNumber");
        currentTrialIndexEl.textContent = this.trialNumber;

        const totalCurrentTrialIndexEl = document.getElementById("totalCurrentTrialNumber");
        totalCurrentTrialIndexEl.textContent = this.totalFinishedTrialsAmount;

        const currentBlockIndexEl = document.getElementById("currentBlockNumber");
        currentBlockIndexEl.textContent = this.blockNumber;

        const totalTrialIndexEl = document.getElementById("totalTrialCount");
        totalTrialIndexEl.textContent = this.getTotalTrials();

        const totalTrialIndexPerBlockEl = document.getElementById("totalTrialCountPerBlock");
        totalTrialIndexPerBlockEl.textContent = this.getTotalTrialsPerBlock();

        const totalBlockIndexEl = document.getElementById("totalBlockCount");
        totalBlockIndexEl.textContent = Config.numBlocks;

        const trialsToBlockIndexEI = document.getElementById("breakCount");
        trialsToBlockIndexEI.textContent = this.getRemainingTrials();
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

    getTotalTrialsPerBlock() {
        return this.currentBlock.getTrialsAmount();
    }

    getRemainingTrials() {
        return this.trialsPerBreak - (this.trialNumber % this.trialsPerBreak);
    }

    // print all the trials on the console
    printAllTrials() {
        for (let i = 0; i < this.experiment.getNumBlocks(); i++) {
            const block = this.experiment.getBlock(i + 1);

            for (let j = 0; j < block.totalTrialsAmount; j++) {
                const trial = block.getTrial(j + 1);
                console.log(trial);
            }
        }
    }
}
