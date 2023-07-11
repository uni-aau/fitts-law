class Experiment {
  constructor() {
    this.experimentType = "STS"; // 
    this.shape = "rectangle"; // rectangle or circle
    this.intDevice = "Mouse";  //"Mouse" , "Touch"  , "Laser Pointer" 
    this.startSize = 10;
    this.rectSize = this.startSize // set the size of the other reectangles
    this.blocks = [];
    this.numBlocks = 1;
    this.numRects = 4;
    let block = 1;

    for (let i = 0; i < this.numBlocks; i++) {
      this.blocks.push(new Block(block, this.experimentType, this.shape, this.intDevice, this.rectSize, this.startSize , this.numRects));
      block++;
    }
  }
  
  getNumBlocks() {
    return this.blocks.length;
  }

  getBlock(blockNumber){
    if (blockNumber >= 1 && blockNumber <= this.numBlocks) {
      return this.blocks[blockNumber-1];
  }
}

  hasNext(blockNumber){
    return this.numBlocks - blockNumber > 0;
  }

  setTargetHeight(targetHeight) {
    this.targetHeight = targetHeight;
  }

  setTargetWidth(targetWidth) {
    this.targetWidth = targetWidth;
  }

  getRandomNonRepeat() {
    this.rectIndices = [];
    this.usedIndices = [];
    for (let i = 0; i < this.numRects; i++) {
      this.rectIndices.push(i);
    }
    const availableIndices = this.rectIndices.filter(index => !this.usedIndices.includes(index));
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    this.usedIndices.push(randomIndex);
    return randomIndex;
  }

  
}

