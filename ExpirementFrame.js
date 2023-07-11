class ExperimentFrame {
  constructor() {
    this.blockNumber = 1;
    this.trialNumber = 1;
    this.experiment = new Experiment();
    this.totalBlocks = this.experiment.getNumBlocks(); // Track the total number of blocks
    // Set the number of trials per break
    this.trialsPerBreak = 3;
  }

  // Show only the target and start rectangles on the screen
  showTrial() {
    const trial = this.experiment.getBlock(this.blockNumber).getTrial(this.trialNumber);
    if (!this.printedFirstBlock) {

      this.printedFirstBlock = true;
      this.printAllTrials();
    }

    const STRectDrawing = new STRectsDrawing(trial, this.trialNumber, this.experiment.rectSize, this.experiment.numRects, () => {
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
    const currentTrialIndexEl = document.getElementById("currentTrialIndex");
    currentTrialIndexEl.innerText = this.trialNumber;

    const currentBlockIndexEl = document.getElementById("totalTrialsIndex");
    currentBlockIndexEl.innerText = this.getTotalTrials();
    
    const  trialsToBlockIndexEI= document.getElementById("trialsToBreakIndex");
    trialsToBlockIndexEI.innerText = this.getRemainingTrials();
  }

  experimentFinished() {
    // Check if it's the last block
    const isLastBlock = this.blockNumber === this.totalBlocks;

    if (isLastBlock) {
      
      // Close the browser window
      window.close();
  }
  }

  getTotalTrials() {
    let totalTrials = 0;
    for (let i = 0; i < this.experiment.getNumBlocks(); i++) {
      const block = this.experiment.getBlock(i + 1);
      totalTrials += block.trialsNum;
    }
    return totalTrials;
  }

  getRemainingTrials(){
    const remainingTrialsToBreak = this.trialsPerBreak - (this.trialNumber % this.trialsPerBreak);
    return remainingTrialsToBreak;
  }

  // print all of the trials on the console
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
