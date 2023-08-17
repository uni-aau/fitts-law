class Experiment {
    constructor() {
        this.experimentType = Config.experimentType;
        this.shape = Config.shape; // rectangle or circle
        this.intDevice = Config.intDevice
        this.startSize = Config.startSize;
        this.rectSize = this.startSize // set the size of the other rectangles
        this.blocks = [];
        this.numBlocks = Config.numBlocks;
        this.numRects = Config.numRects;
        let block = 1;

        for (let i = 0; i < this.numBlocks; i++) {
            this.blocks.push(new Block(block, this.experimentType, this.shape, this.intDevice, this.rectSize, this.startSize, this.numRects));
            block++;
        }
    }

    getNumBlocks() {
        return this.blocks.length;
    }

    getBlock(blockNumber) {
        if (blockNumber >= 1 && blockNumber <= this.numBlocks) {
            return this.blocks[blockNumber - 1];
        }
    }

    hasNext(blockNumber) {
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

