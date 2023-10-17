<?php
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin (not recommended for production)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postData = file_get_contents("php://input");
    $file = 'data.csv';

    if (file_put_contents($file, $postData)) {
        echo 'File updated';
    } else {
        echo 'Error writing to file';
    }
} else {
    echo 'Invalid request';
}
?>