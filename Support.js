// Calculate the mm value in pixels to ensure that it is everywhere the same size
function mm2px(valueMM) {
    const width = window.screen.width * window.devicePixelRatio;
    const height = window.screen.height * window.devicePixelRatio;
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    // const totalCurrentTrialIndexEl = document.getElementById("totalCurrentTrialNumber");
    // totalCurrentTrialIndexEl.textContent = `${winWidth} / ${winHeight}`;

    console.log(`Width ${width} / ${winWidth} | Height ${height} / ${winHeight})`);

    // Hinweis - Zoom muss 100% sein!
    const ppi = 151.32; // Convert  mm to pixels
    return (valueMM * ppi) / 25.4;
}

// https://www.calculatorsoup.com/calculators/technology/ppi-calculator.php
// Berechnung - Fullscreen -> winWidth, winHeight, dann Diagonale aus Internet und das dann in PPI eingeben
