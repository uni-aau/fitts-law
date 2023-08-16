class ExperimentFrame {

    constructor() {
        this.blockNumber = 1;
        this.trialNumber = 1;
        this.experiment = new Experiment();
        this.totalBlocks = this.experiment.getNumBlocks(); // Track the total number of blocks
        // Set the number of trials per break
        this.trialsPerBreak = Config.trialsPerBreak;
        this.dataRecorder = new DataRecorder();
    }

    initializeExperiment() {
        this.username = document.getElementById("name_input").value;
        if(this.username === "") {
            console.log("No username inserted - Using general username");
            this.username = Config.generalUsername;
        }
        this.showTrial();
    }

    // Show only the target and start rectangles on the screen
    showTrial() {

        const trial = this.experiment.getBlock(this.blockNumber).getTrial(this.trialNumber);
        if (!this.printedFirstBlock) {

            this.printedFirstBlock = true;
            this.printAllTrials();
        }

        const STRectDrawing = new STRectsDrawing(trial, this.trialNumber, this.experiment.rectSize, this.experiment.numRects, this.dataRecorder, this.username, () => {
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
        // Get the break window modal
        const breakWindow = document.getElementById('breakWindow');
        // Show the modal
        breakWindow.style.display = 'block';

        // Disable the rest of the page interaction while the break window is visible
        document.body.style.pointerEvents = 'none';

        // Get the continue button
        const continueButton = document.getElementById('continueButton');

        // Event listener for the continue button
        continueButton.addEventListener('click', () => {
            // Hide the break window modal
            breakWindow.style.display = 'none';

            // Enable the page interaction again
            document.body.style.pointerEvents = 'auto';
        });
    }

    // TODO update comments
    // Function to display the break window
    displayFinishWindow() {
        // Get the break window modal
        const finishWindow = document.getElementById('finishWindow');
        // Show the modal
        finishWindow.style.display = 'block';

        // Disable the rest of the page interaction while the break window is visible
        document.body.style.pointerEvents = 'none';

        const downloadDataButton = document.getElementById('downloadData');

        // Event listener for the continue button
        downloadDataButton.addEventListener('click', () => {
            this.dataRecorder.generateCSVDownloadLink(true);
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
            // showStartWindow();
            this.displayFinishWindow()

        }
    }

    getTotalTrialsPerBlock() {
        return this.getTotalTrials() / Config.numBlocks;
    }

    getTotalTrials() {
        let totalTrials = 0;
        for (let i = 0; i < this.experiment.getNumBlocks(); i++) {
            const block = this.experiment.getBlock(i + 1);
            totalTrials += block.trialsNum;
        }
        return totalTrials;
    }

    getRemainingTrials() {
        return this.trialsPerBreak - (this.trialNumber % this.trialsPerBreak);
    }

    // print all the trials on the console
    printAllTrials() {
        for (let i = 0; i < this.experiment.getNumBlocks(); i++) {
            const block = this.experiment.getBlock(i + 1);

            for (let j = 0; j < block.trialsNum; j++) {
                const trial = block.getTrial(j + 1);
                console.log(trial);
            }
        }
    }
}
