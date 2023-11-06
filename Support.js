// Calculate the mm value in pixels to ensure that it is everywhere the same size
function mm2px(valueMM) {
    return (valueMM * Config.ppi) / 25.4;
}

function getPPI() {
    return Config.ppi;
}

function get1MMInPx() {
    return Config.ppi / 25.4;
}

function getWindowInnerWidth() {
    return window.innerWidth;
}

function getWindowInnerHeight() {
    return window.innerHeight;
}

// https://www.calculatorsoup.com/calculators/technology/ppi-calculator.php
// Berechnung - Fullscreen -> winWidth, winHeight, dann Diagonale aus Internet und das dann in PPI eingeben
// const totalCurrentTrialIndexEl = document.getElementById("totalCurrentTrialNumber");
// totalCurrentTrialIndexEl.textContent = `${winWidth} / ${winHeight}`;
