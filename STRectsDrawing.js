class STRectsDrawing {
    constructor(trial, trialNumber, rectSize, numRects, dataRecorder, username, onTargetClicked) {
        this.shape = trial.shape;
        this.startClicked = false;
        this.isTargetClicked = false;
        this.startIndex = trial.startIndex;
        this.targetIndex = trial.targetIndex;
        this.numRects = numRects;
        this.amplitude = trial.amplitude;
        this.startSize = trial.startSize;
        this.targetWidth = trial.targetWidth;
        this.targetHeight = trial.targetHeight;
        this.trialId = trial.trialId;
        this.trialDirection = trial.trialDirection;
        this.onTargetClicked = onTargetClicked;
        this.handleCanvasClick = this.handleCanvasClick.bind(this);
        this.trialNumber = trialNumber;
        this.intDevice = trial.intDevice;
        this.dataRecorder = dataRecorder;
        this.username = username;

        this.touchDownPositionX = 0;
        this.touchDownPositionY = 0;
        this.touchUpPositionX = 0;
        this.touchUpPositionY = 0;
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);

        this.isMiss = false;            // determines if the trial had a miss
        this.clicksAmount = 0;          // determines the amount of clicks until the trial was finished
        this.missAmount = 0;            // determines the overall miss amount until the target rectangle was clicked (also in tolerance incremented)
        this.missInToleranceAmount = 0; // determines the misses that are in the tolerance range (relevant if skip at miss is disabled)
    }

    initializeVariables(canvas) {
        const canvasCenterX = canvas.width / 2;
        const canvasCenterY = canvas.height / 2;
        const amplitudePx = mm2px(this.amplitude);
        const angle = (2 * Math.PI) / this.numRects;

        // Coordinates of the start center point
        this.startCenterX = canvasCenterX + amplitudePx * Math.cos(this.startIndex * angle);
        this.startCenterY = canvasCenterY + amplitudePx * Math.sin(this.startIndex * angle);

        this.startSizePx = mm2px(this.startSize); // size of start element (it's currently always a*a)

        // Coordinates of the target center point
        this.targetCenterX = canvasCenterX + amplitudePx * Math.cos(this.targetIndex * angle);
        this.targetCenterY = canvasCenterY + amplitudePx * Math.sin(this.targetIndex * angle);
    }

    showRects() {
        // Defines canvas
        let canvasOld = document.getElementById("trialCanvas");
        const canvas = this.removeAllEventListeners(canvasOld) // otherwise multiple clicksAmount will be registered
        const context = canvas.getContext("2d");

        // Calculates width/height of window and clears rect
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.addEventListener("click", this.handleCanvasClick);

        this.initializeVariables(canvas)

        // Start element creation
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = Config.elementStrokeStyle;
        context.fillStyle = Config.startElementFillStyle;


        // Coordinates of top left corner of the rectangle (center - half of the width of rect)
        const rectX = this.startCenterX - this.startSizePx / 2;
        const rectY = this.startCenterY - this.startSizePx / 2;

        document.addEventListener("mousedown", this.handleMouseDown);
        document.addEventListener("mouseup", this.handleMouseUp);

        if (this.shape === "rectangle") {
            context.strokeRect(
                rectX,
                rectY,
                this.startSizePx,
                this.startSizePx
            );
            context.fillRect(
                rectX,
                rectY,
                this.startSizePx,
                this.startSizePx
            );
        } else if (this.shape === "circle") {
            context.beginPath();
            context.arc(this.startCenterX, this.startCenterY, this.startSizePx / 2, 0, 2 * Math.PI);
            context.stroke();
            context.fill();
        } else {
            console.error("No shape with the name " + this.shape + " registered");
        }

        // Target Element creation
        context.fillStyle = Config.targetElementFillStyle;

        // Coordinates of top left corner of the rectangle (center - half of the width of rect)
        const targetWidthPx = mm2px(this.targetWidth);
        const targetHeightPx = mm2px(this.targetHeight);
        const targetRectX = this.targetCenterX - targetWidthPx / 2;
        const targetRectY = this.targetCenterY - targetHeightPx / 2;

        if (this.shape === "rectangle") {
            context.strokeRect(
                targetRectX,
                targetRectY,
                targetWidthPx,
                targetHeightPx
            );
            context.fillRect(
                targetRectX,
                targetRectY,
                targetWidthPx,
                targetHeightPx
            );
        } else if (this.shape === "circle") {
            const targetSize = mm2px(this.targetWidth);
            context.beginPath();
            context.arc(this.targetCenterX, this.targetCenterY, targetSize / 2, 0, 2 * Math.PI);
            context.stroke();
            context.fill();
        } else {
            alert("No shape as " + this.shape + " is registered!")
            console.error("No shape with the name " + this.shape + " registered");
        }
        this.printToConsole();
    }

    removeAllEventListeners(element) {
        const clone = element.cloneNode(true);
        element.parentNode.replaceChild(clone, element);
        return clone;
    }

    handleCanvasClick(event) {
        const canvas = document.getElementById("trialCanvas");
        const context = canvas.getContext("2d");

        // Handle click position
        const rect = canvas.getBoundingClientRect();
        this.pressedX = event.clientX - rect.left;
        this.pressedY = event.clientY - rect.top;
        console.log("PressX = " + this.pressedX + " PressY = " + this.pressedY);

        this.initializeVariables(canvas);
        this.clicksAmount++;

        // Checks whether the click was in the start rectangle
        const targetWidthPx = mm2px(this.targetWidth); // Width of the target rectangle
        const targetHeightPx = mm2px(this.targetHeight); // Height of the target rectangle
        const halfWidthPx = this.startSizePx / 2;
        const isRectangleClickInStartElement = this.pressedX >= this.startCenterX - halfWidthPx &&
            this.pressedX <= this.startCenterX + halfWidthPx &&
            this.pressedY >= this.startCenterY - halfWidthPx &&
            this.pressedY <= this.startCenterY + halfWidthPx


        // Checks whether the click was in the start circle
        this.clickDistanceToStartCenter = Math.sqrt((this.pressedX - this.startCenterX) ** 2 + (this.pressedY - this.startCenterY) ** 2);
        const isCircleClickInStartElement = this.clickDistanceToStartCenter < this.startSizePx / 2;

        // Determines if the click was in the specific start shape
        let isInStartRange = false;
        if (this.shape === "rectangle") isInStartRange = isRectangleClickInStartElement;
        else if (this.shape === "circle") isInStartRange = isCircleClickInStartElement;

        if (!this.startClicked && isInStartRange) {
            // Determines the start touchDown and touchUp position
            this.startClickedPostitionXTouchDown = this.touchDownPositionX;
            this.startClickedPositionYTouchDown = this.touchDownPositionY;
            this.startClickedPositionXTouchUp = this.touchUpPositionX;
            this.startClickedPositionYTouchUp = this.touchUpPositionY;


            this.startTimeStartToEndClick = performance.now();

            // Clicked on the start
            context.fillStyle = Config.targetElementSelectionStyle;
            context.beginPath(); // removes previous drawing operations

            if (this.shape === "rectangle") {
                context.fillRect(this.targetCenterX - targetWidthPx / 2, this.targetCenterY - targetHeightPx / 2, targetWidthPx, targetHeightPx);
            } else if (this.shape === "circle") {
                const startSizePx = mm2px(this.startSize) / 2;
                context.arc(this.startCenterX, this.startCenterY, startSizePx, 0, 2 * Math.PI);
                context.fill();
            }
            this.startClicked = true;
        } else { // Clicked outside the start
            // Determines click in target rectangle
            const targetSizeHalfWidthPx = targetWidthPx / 2;
            const targetSizeHalfHeightPx = targetHeightPx / 2;
            const isRectangleClickInTargetElement = this.pressedX >= this.targetCenterX - targetSizeHalfWidthPx &&
                this.pressedX <= this.targetCenterX + targetSizeHalfWidthPx &&
                this.pressedY >= this.targetCenterY - targetSizeHalfHeightPx &&
                this.pressedY <= this.targetCenterY + targetSizeHalfHeightPx
            const isRectangleClickInTargetElementWithTolerance = this.pressedX >= this.targetCenterX - targetSizeHalfWidthPx - Config.clickTolerancePx &&
                this.pressedX <= this.targetCenterX + targetSizeHalfWidthPx + Config.clickTolerancePx &&
                this.pressedY >= this.targetCenterY - targetSizeHalfHeightPx - Config.clickTolerancePx &&
                this.pressedY <= this.targetCenterY + targetSizeHalfHeightPx + Config.clickTolerancePx

            // Determines click in target circle
            this.distanceToTargetCenter = Math.sqrt((this.pressedX - this.targetCenterX) ** 2 + (this.pressedY - this.targetCenterY) ** 2);
            const targetSizePx = mm2px(this.targetWidth); // todo vereinigen mit start
            const isCircleClickInTargetElement = this.distanceToTargetCenter < targetSizePx / 2;
            const isCircleClickInTargetElementWithTolerance = this.distanceToTargetCenter < (targetSizePx + Config.clickTolerancePx) / 2;
            console.log("Click in circle? " + isCircleClickInTargetElement + " / " + isCircleClickInTargetElementWithTolerance + " / " + isRectangleClickInTargetElement)

            if (this.startClicked && !this.isTargetClicked) {
                this.endTimeClickStartToEnd = performance.now(); // Determines the time between start and target click

                // Determines the target touchDown and touchUp position
                this.targetClickedPostitionXTouchDown = this.touchDownPositionX;
                this.targetClickedPositionYTouchDown = this.touchDownPositionY;
                this.targetClickedPositionXTouchUp = this.touchUpPositionX;
                this.targetClickedPositionYTouchUp = this.touchUpPositionY;

                // Determines the click radius for circle or rectangle (need to be recoded when more shapes are added)
                const isInTargetElement = this.shape === "rectangle"
                    ? isRectangleClickInTargetElement
                    : isCircleClickInTargetElement;

                const isInTargetElementWithTolerance = this.shape === "rectangle"
                    ? isRectangleClickInTargetElementWithTolerance
                    : isCircleClickInTargetElementWithTolerance;

                if (isInTargetElement) {
                    console.log("Click was inside the element. Misses in tolerance = " + this.missInToleranceAmount + " / Overall misses = " + this.missAmount);
                    this.finishTrial()
                } else if (isInTargetElementWithTolerance) {
                    console.log("Click was in " + Config.clickTolerancePx + "px click tolerance")
                    this.isMiss = true;
                    this.missAmount++;
                    this.missInToleranceAmount++;
                    if (Config.isMissSkipped) {
                        this.finishTrial();
                    } else {
                        // TODO message to do again?
                    }
                } else {
                    this.missAmount++;
                    console.log("Click was not in tolerance")
                }
            }
        }
    }

    handleMouseDown(event) {
        this.touchDownPositionX = event.clientX;
        this.touchDownPositionY = event.clientY;
    }

    handleMouseUp(event) {
        this.touchUpPositionX = event.clientX;
        this.touchUpPositionY = event.clientY;
    }

    handleTargetClick() {
        // Used to save data or print to console
        console.log("Successfully clicked on target!");
        this.printTrial();
        this.saveTrialData();
    }

    finishTrial() {
        this.onTargetClicked();
        this.handleTargetClick();
        this.isTargetClicked = true;
    }

    printTrial() {
        console.log(`Information about finished trial: Amplitude: ${this.amplitude} (${mm2px(this.amplitude)}px) | Coordinates of Start center point: X=${this.startCenterX} Y=${this.startCenterY} | Coordinates of Target center point: X=${this.targetCenterX} Y=${this.targetCenterY}`);
        console.log(`Information about click position: StartTouchDown: X=${this.startClickedPostitionXTouchDown} Y=${this.startClickedPositionYTouchDown}, StartTouchUp: X=${this.startClickedPositionXTouchUp} Y=${this.startClickedPositionYTouchUp}, TargetTouchDown: X=${this.targetClickedPostitionXTouchDown} Y=${this.targetClickedPositionYTouchDown}, TargetTouchUp: X=${this.targetClickedPositionXTouchUp} Y=${this.targetClickedPositionYTouchUp}`);
        console.log(`Information about click: Click distance to start center: ${this.clickDistanceToStartCenter} | Click distance to target center: ${this.distanceToTargetCenter} | isMiss? ${this.isMiss} | Miss Amount: ${this.missAmount} | Miss in tolerance: ${this.missInToleranceAmount} | Click tolerancePx: ${Config.clickTolerancePx}`);
    }

    // TODO check size bei circle
    saveTrialData() {
        this.takenTimeToClickFromStartToEndMs = this.endTimeClickStartToEnd - this.startTimeStartToEndClick;

        this.dataRecorder.addDataRow([this.trialNumber, this.trialId, this.username, this.shape, this.intDevice, this.startIndex, this.targetIndex,
            this.amplitude, this.startSize, this.targetWidth, this.targetHeight, this.trialDirection,
            this.startCenterX, this.startCenterY, this.targetCenterX, this.targetCenterY, this.startClickedPostitionXTouchDown, this.startClickedPositionYTouchDown,
            this.startClickedPositionXTouchUp, this.startClickedPositionYTouchUp, this.targetClickedPostitionXTouchDown, this.targetClickedPositionYTouchDown,
            this.targetClickedPositionXTouchUp, this.targetClickedPositionYTouchUp, this.clickDistanceToStartCenter,
            this.distanceToTargetCenter, this.isMiss, this.missAmount, this.missInToleranceAmount, this.clicksAmount, this.takenTimeToClickFromStartToEndMs]);

        console.log(this.dataRecorder.getDataArray());
        this.dataRecorder.generateCSVDownloadLink(false);
    }

    // TODO
    /*
    - Fully remove pressedX and replace it witH touchDown method
    */

    printToConsole() {
        console.log(
            "Information from Drawing: " +
            "Username: " +
            this.username +
            " | Trial Number: " +
            this.trialNumber +
            " | Trial ID: " +
            this.trialId +
            " | Shape: " +
            this.shape +
            " | Interaction Device: " +
            this.intDevice +
            " | Start Size: " +
            this.startSize +
            " | Start Index: " +
            this.startIndex +
            " | Target Index: " +
            this.targetIndex +
            " | Amplitude: " +
            this.amplitude +
            " | Target Width: " +
            this.targetWidth +
            " | Target Height: " +
            this.targetHeight +
            " | Trail Direction: " +
            this.trialDirection
        );
    }
}

