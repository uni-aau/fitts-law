// Calculate the mm value in pixels to ensure that it is everywhere the same size
function mm2px(valueMM) {
    const width = window.screen.width * window.devicePixelRatio;
    const height = window.screen.height * window.devicePixelRatio;
    const winWidth = getWindowInnerWidth();
    const winHeight = getWindowInnerHeight();

    console.log(`Width ${width} / ${winWidth} | Height ${height} / ${winHeight})`);

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
