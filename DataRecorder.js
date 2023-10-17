class DataRecorder {
    constructor() {
        this.dataArray = [];

        this.dataArray.push(["serial_number", "trial_number", "trial_id", "trial_category", "block_number", "username", "shape", "int_device",
            "amplitude", "start_size", "target_width", "target_height",
            "trial_direction", "trial_angle", "start_center_x", "start_center_y", "target_center_x", "target_center_y",
            "start_click_touchdown_position_x", "start_click_touchdown_position_y", "start_click_touchup_position_x",
            "start_click_touchup_position_y", "target_click_touchdown_position_x", "target_click_touchdown_position_y",
            "target_click_touchup_position_x", "target_click_touchup_position_y", "click_distance_to_start_center",
            "click_distance_to_target_center", "isMiss", "miss_amount", "miss_in_tolerance_amount", "clicks_amount",
            "click_time_from_start_to_target_ms", "start_click_time_touchdown_to_touchup_ms", "target_click_time_touchdown_to_touchup_ms"]);
    }

    addDataRow(data) {
        this.dataArray.push(data);
    }

    getDataArray() {
        return this.dataArray;
    }

    generateCsvDownloadLink(isDownload) {
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

    publishCsvToServer() {
        const jsonData = this.dataArray.map(row => row.join(',')).join('\n');

        fetch(Config.serverRequestLink, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: jsonData,
        })
            .then(response => response.text())
            .then(data => {
                console.log(data); // server response
            });
    }
}