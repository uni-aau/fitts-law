<?php
header("Access-Control-Allow-Origin: http://david.jamnig.net/tests/fittslaw"); // Allows requests from specific origin
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postData = file_get_contents("php://input");

    // Determines accurate time for unique filename
    date_default_timezone_set('Europe/Vienna'); // Sets the timezone to Austria (Europe/Vienna)
    $timestamp = microtime(true);
    $milliseconds = round(($timestamp - floor($timestamp)) * 100000);
    $dateTime = date("Ymd_His", floor($timestamp));

    $file = "../trialdata/data_{$dateTime}_{$milliseconds}.csv";


    if (file_put_contents($file, $postData)) {
        echo "[SERVER] File updated ($file)";
    } else {
        $errorInfo = error_get_last();
        if ($errorInfo !== null) {
            echo "[SERVER] Error writing to file ($file). Error: " . $errorInfo['message'];
        } else {
            echo "[SERVER] Error writing to file ($file). No error information available.";
        }
    }
} else {
    echo '[SERVER] Invalid request - Only POST allowed';
}
?>