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

    generateCSVDownloadLink() {
        const csvContent = this.dataArray.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.csv';
        link.textContent = 'Download CSV';

        document.body.appendChild(link);
        console.log(link);
    }
}