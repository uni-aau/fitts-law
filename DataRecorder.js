class DataRecorder {
    constructor() {
        this.dataArray = [];

        this.dataArray.push(["trial_number", "trial_id", "username", "shape", "int_device",
            "start_index", "target_index", "amplitude", "start_size", "target_width", "target_height",
            "trial_direction", "start_center_x", "start_center_y", "target_center_x", "target_center_y",
            "start_click_touchdown_position_x", "start_click_touchdown_position_y", "start_click_touchup_position_x",
            "start_click_touchup_position_y", "target_click_touchdown_position_x", "target_click_touchdown_position_y",
            "target_click_touchup_position_x", "target_click_touchup_position_y", "click_distance_to_start_center",
            "click_distance_to_target_center", "isMiss", "miss_amount", "miss_in_tolerance_amount", "clicks_amount", "taken_time_to_click_ms", "taken_time_to_click_s"]);
    }

    addDataRow(data) {
        this.dataArray.push(data);
    }

    getDataArray() {
        return this.dataArray;
    }

    generateCSVDownloadLink(isDownload) {
        const csvContent = this.dataArray.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], {type: 'text/csv'});
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.csv';
        link.textContent = 'Download CSV';

        this.printDownloadableCsvFileToConsole(link)
        if (isDownload) this.downloadGeneratedCsvFile(link);
    }

    downloadGeneratedCsvFile(link) {
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    printDownloadableCsvFileToConsole(link) {
        document.body.appendChild(link);
        console.log(link);
    }
}