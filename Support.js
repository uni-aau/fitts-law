// Calculate the radius in pixels
function mm2px(valueMM) {
    // Get the PPI of the screen
    const ppi = window.devicePixelRatio * 96; // assuming a default DPI of 96
    // console.error("PPI: " + calcScreenDPI())
    return valueMM * (ppi / 25.4); // Convert  mm to pixels
}

function calcScreenDPI() {
    const el = document.createElement('div');
    el.style = 'width: 1in;'
    document.body.appendChild(el);
    const dpi = el.offsetWidth;
    document.body.removeChild(el);

    return dpi;
}

function clacScreenDPI2() {
    function getScreenDPI() {
        // Create a hidden div element to measure physical screen size
        var div = document.createElement('div');
        div.style.width = '1in';
        div.style.height = '1in';
        div.style.position = 'absolute';
        div.style.left = '-100%';
        div.style.top = '-100%';
      
        // Add the div to the DOM
        document.body.appendChild(div);
      
        // Measure the div's dimensions in pixels
        var width = div.offsetWidth;
        var height = div.offsetHeight;
      
        // Remove the div from the DOM
        document.body.removeChild(div);
      
        // Calculate DPI based on screen resolution and physical size
        var screenWidth = window.screen.width;
        var screenHeight = window.screen.height;
        var horizontalDPI = screenWidth / width;
        var verticalDPI = screenHeight / height;
      
        return {
          horizontalDPI: horizontalDPI,
          verticalDPI: verticalDPI,
        };
      }
      
      var screenDPI = getScreenDPI();
      console.log('Horizontal DPI:', screenDPI.horizontalDPI);
      console.log('Vertical DPI:', screenDPI.verticalDPI);
      
}
