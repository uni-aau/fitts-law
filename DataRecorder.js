class DataRecorder {
    constructor() {
        this.dataArray = [];

        this.dataArray.push([
            "serial_number",
            "is_test_set",
            "block_number",
            "trial_number",
            "trial_id",
            "trial_category",
            "trial_gets_repeated",
            "click_category",
            "trial_repetitions",
            "username",
            "shape",
            "int_device",
            "ppi",
            "mm_in_pixel",
            "window_inner_width",
            "window_inner_height",
            "amplitude_mm",
            "amplitude_px",
            "start_size_mm",
            "start_size_px",
            "target_width_mm",
            "target_width_px",
            "target_height_mm",
            "target_height_px",
            "trial_direction",
            "trial_angle_degree",
            "start_center_x_px",
            "start_center_y_px",
            "target_center_x_px",
            "target_center_y_px",
            "start_click_touchdown_position_x_px",
            "start_click_touchdown_position_y_px",
            "start_click_touchup_position_x_px",
            "start_click_touchup_position_y_px",
            "target_click_touchdown_position_x_px",
            "target_click_touchdown_position_y_px",
            "target_click_touchup_position_x_px",
            "target_click_touchup_position_y_px",
            "click_distance_between_target_touchdown_touchup_px",
            "click_distance_to_start_center_touchdown_xy_px",
            "click_distance_to_start_center_touchdown_x_px",
            "click_distance_to_start_center_touchdown_y_px",
            "click_distance_to_start_center_touchup_xy_px",
            "click_distance_to_start_center_touchup_x_px",
            "click_distance_to_start_center_touchup_y_px",
            "click_distance_to_target_center_touchdown_xy_px",
            "click_distance_to_target_center_touchdown_x_px",
            "click_distance_to_target_center_touchdown_y_px",
            "click_distance_to_target_center_touchup_xy_px",
            "click_distance_to_target_center_touchup_x_px",
            "click_distance_to_target_center_touchup_y_px",
            "total_clicks_amount",
            "clicks_amount_after_start_click",
            "click_time_from_start_to_target_ms",
            "start_click_time_touchdown_to_touchup_ms",
            "target_click_time_touchdown_to_touchup_ms",
            "time_stamp_after_last_touch_up"
        ]);
    }

    addDataRow(data) {
        this.dataArray.push(data);
    }

    getDataArray() {
        return this.dataArray;
    }

    generateCsvDownloadLink(isDownload) {
        const csvContent = this.dataArray.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
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
            .then(data => console.log(data)) // server response
            .catch(error => console.error("Error fetching request: " + error));
    }
}