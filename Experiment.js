class Experiment {
    constructor() {
        this.experimentType = Config.experimentType;
        this.shape = Config.shape.toLowerCase(); // rectangle or circle
        this.intDevice = Config.intDevice
        this.startSize = Config.startSize;
        this.blocks = [];
        this.numBlocks = Config.numBlocks;
        let block = 1;

        for (let i = 0; i < this.numBlocks; i++) {
            this.blocks.push(new Block(block, this.experimentType, this.shape, this.intDevice, this.startSize));
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
}

