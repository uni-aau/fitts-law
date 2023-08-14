class DataRecorder {
    constructor() {
        this.dataArray = [];
        this.dataArray.push(["test1", "test2", "test3"])
    }

    addDataRow(data) {
        this.dataArray.push(data);
    }

    getDataArray() {
        return this.dataArray;
    }
}