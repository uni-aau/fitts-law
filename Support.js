// Calculate the radius in pixels
function mm2px(valueMM) {

    // Get the PPI of the screen
    const ppi = window.devicePixelRatio * 96; // assuming a default DPI of 96
    // Convert  mm to pixels
    return valueMM * (ppi / 25.4);
}



