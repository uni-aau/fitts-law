class DataRecorder {
    constructor() {
        this.dataArray = [];

        // TODO click time
        this.dataArray.push(["trial_number", "trial_id", "user_id", "shape", "int_device", "start_index", "target_index", "amplitude", "amplitude_px", "start_size", "target_width", "target_height", "trial_direction", "start_center_x", "start_center_y", "target_center_x", "target_center_y", "last_clicked_x", "last_clicked_y", "click_distance_to_start_center", "click_distance_to_target_center", "isMiss", "miss_amount"]);
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