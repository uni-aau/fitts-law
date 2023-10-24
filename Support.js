// Calculate the radius in pixels
function mm2px(valueMM) {
    // Get the PPI of the screen
    // const ppi = window.devicePixelRatio * 96; // assuming a default DPI of 96
    // Hinweis - Zoom muss 100% sein!
    const ppi = 551.44;
    let value = (valueMM * ppi) / 25.4; // Convert  mm to pixels
    return value;
}
