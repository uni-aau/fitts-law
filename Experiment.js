class Experiment {
    constructor() {
        this.shape = Config.shape.toLowerCase(); // rectangle or circle
        this.startSize = Config.startSize;
        this.blocks = [];
        this.numBlocks = Config.isTestSet ? Config.numBlocksTestSet : Config.numBlocksTrainingsSet;
        let block = 1;

        for (let i = 0; i < this.numBlocks; i++) {
            this.blocks.push(new Block(block, this.shape, this.startSize));
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

