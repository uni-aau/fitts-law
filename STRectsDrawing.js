class STRectsDrawing {
    constructor(trial, currentBlock, blockNumber, trialNumber, serialNumber, dataRecorder, username, onTargetClicked) {
        this.shape = trial.shape;
        this.trialClockAngle = trial.trialClockAngle;
        this.trialDirection = trial.trialDirection;
        this.amplitude = trial.amplitude;
        this.startSize = trial.startSize;
        this.targetWidth = trial.targetWidth;
        this.targetHeight = trial.targetHeight;
        this.trialId = trial.trialId;
        this.intDevice = trial.intDevice;
        this.trialCategory = trial.trialCategory;

        this.onTargetClicked = onTargetClicked;
        this.trialNumber = trialNumber;
        this.dataRecorder = dataRecorder;
        this.username = username;
        this.currentBlock = currentBlock;
        this.blockNumber = blockNumber;
        this.serialNumber = serialNumber;

        this.handleCanvasClick = this.handleCanvasClick.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);

        this.initializeVariables();
    }

    initializeVariables() {
        this.touchDownPositionX = 0;
        this.touchDownPositionY = 0;
        this.touchUpPositionX = 0;
        this.touchUpPositionY = 0;

        this.clicksAmount = 0;          // determines the amount of clicks until the trial was finished
        this.missAmount = 0;            // determines the overall miss amount until the target rectangle was clicked (also in tolerance incremented)
        this.missInToleranceAmount = 0; // determines the misses that are in the tolerance range (relevant if skip at miss is disabled)
        this.isMiss = false;            // determines if the trial had a miss
        this.startClicked = false;
        this.isTargetClicked = false;
    }

    initializeCanvasVariables(canvas) {
        const canvasCenterX = canvas.width / 2;
        const canvasCenterY = canvas.height / 2;
        const amplitudePx = mm2px(this.amplitude);

        const startAngle = this.trialClockAngle;
        const targetAngle = (startAngle + 180) % 360; // opposite direction of angle
        const startAngleRad = (startAngle * Math.PI) / 180;
        const targetAngleRad = (targetAngle * Math.PI) / 180;

        // Coordinates of the start center point
        this.startCenterX = canvasCenterX + amplitudePx * Math.cos(startAngleRad);
        this.startCenterY = canvasCenterY + amplitudePx * Math.sin(startAngleRad);

        this.startSizePx = mm2px(this.startSize); // size of start element (it's currently always a*a)

        // Coordinates of the target center point
        this.targetCenterX = canvasCenterX + amplitudePx * Math.cos(targetAngleRad);
        this.targetCenterY = canvasCenterY + amplitudePx * Math.sin(targetAngleRad);
    }

    showRects() {
        const canvas = this.setUpCanvas();
        const context = canvas.getContext("2d");

        // Start element creation
        context.clearRect(0, 0, canvas.width, canvas.height);

        this.drawStartElement(context);
        this.drawTargetElement(context);

        document.addEventListener("mousedown", this.handleMouseDown);
        document.addEventListener("mouseup", this.handleMouseUp);

        this.printToConsole();
    }

    setUpCanvas() {
        // Defines canvas
        let canvasOld = document.getElementById("trialCanvas");
        let canvas = this.removeAllEventListeners(canvasOld) // otherwise multiple clicksAmount will be registered

        // Calculates width/height of window and clears rect
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.addEventListener("click", this.handleCanvasClick);

        this.initializeCanvasVariables(canvas)

        return canvas;
    }

    drawStartElement(context) {
        context.strokeStyle = Config.elementStrokeStyle;
        context.fillStyle = Config.startElementFillStyle;

        // Coordinates of top left corner of the rectangle (center - half of the width of rect)
        const topLeftStartRectCornerX = this.startCenterX - this.startSizePx / 2;
        const topLeftStartRectCornerY = this.startCenterY - this.startSizePx / 2;

        if (this.shape === "rectangle") {
            context.strokeRect(topLeftStartRectCornerX, topLeftStartRectCornerY, this.startSizePx, this.startSizePx);
            context.fillRect(topLeftStartRectCornerX, topLeftStartRectCornerY, this.startSizePx, this.startSizePx);
        } else if (this.shape === "circle") {
            context.beginPath();
            context.arc(this.startCenterX, this.startCenterY, this.startSizePx / 2, 0, 2 * Math.PI);
            context.stroke();
            context.fill();
        } else {
            this.alertWronglyRegistered();
        }
    }

    drawTargetElement(context) {
        const randomIndex = Math.floor(Math.random() * Config.targetElementFillStyle.length); // determines a random target color
        context.fillStyle = Config.targetElementFillStyle[randomIndex];
        context.strokeStyle = Config.elementStrokeStyle;

        // Coordinates of top left corner of the rectangle (center - half of the width of rect)
        const targetWidthPx = mm2px(this.targetWidth);      // TODO auch in intitalizeVariables?
        const targetHeightPx = mm2px(this.targetHeight);    // TODO auch in intitalizeVariables?
        const topLeftTargetRectCornerX = this.targetCenterX - targetWidthPx / 2;
        const topLeftTargetRectCornerY = this.targetCenterY - targetHeightPx / 2;

        if (this.shape === "rectangle") {
            context.strokeRect(topLeftTargetRectCornerX, topLeftTargetRectCornerY, targetWidthPx, targetHeightPx);
            context.fillRect(topLeftTargetRectCornerX, topLeftTargetRectCornerY, targetWidthPx, targetHeightPx);
        } else if (this.shape === "circle") {
            const targetSizePx = mm2px(this.targetWidth); // TODO size = height setzen
            context.beginPath();
            context.arc(this.targetCenterX, this.targetCenterY, targetSizePx / 2, 0, 2 * Math.PI);
            context.stroke();
            context.fill();
        } else {
            this.alertWronglyRegistered();
        }
    }

    alertWronglyRegistered() {
        alert(`No shape as ${this.shape} is registered!`)
        console.error(`No shape with the name ${this.shape} registered!`);
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

        this.initializeCanvasVariables(canvas);
        this.clicksAmount++;

        // Checks whether the click was in the start rectangle
        const targetWidthPx = mm2px(this.targetWidth); // Width of the target rectangle // TODO mehrfach targetWidth
        const targetHeightPx = mm2px(this.targetHeight); // Height of the target rectangle
        const halfWidthPx = this.startSizePx / 2;


        if (!this.startClicked) {
            // Checks whether the click was in the start circle
            this.clickDistanceToStartCenter = Math.sqrt((this.pressedX - this.startCenterX) ** 2 + (this.pressedY - this.startCenterY) ** 2);
            const isCircleClickInStartElement = this.clickDistanceToStartCenter < this.startSizePx / 2;
            const isRectangleClickInStartElement = this.pressedX >= this.startCenterX - halfWidthPx &&
                this.pressedX <= this.startCenterX + halfWidthPx &&
                this.pressedY >= this.startCenterY - halfWidthPx &&
                this.pressedY <= this.startCenterY + halfWidthPx

            // Determines if the click was in the specific start shape
            let isInStartRange = false;
            if (this.shape === "rectangle") isInStartRange = isRectangleClickInStartElement;
            else if (this.shape === "circle") isInStartRange = isCircleClickInStartElement;

            // If click was in the start object
            if (isInStartRange) {
                // Determines the start touchDown and touchUp position
                this.startClickedPostitionXTouchDown = this.touchDownPositionX;
                this.startClickedPositionYTouchDown = this.touchDownPositionY;
                this.startClickedPositionXTouchUp = this.touchUpPositionX;
                this.startClickedPositionYTouchUp = this.touchUpPositionY;
                this.startTimeTouchDownToTouchUpMs = this.getTouchDownTouchUpTimeDifference();

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
            }
        } else { // Start was already clicked
            // Determines click in target rectangle
            const targetSizeHalfWidthPx = targetWidthPx / 2;
            const targetSizeHalfHeightPx = targetHeightPx / 2;
            const isRectangleClickInTargetElement = this.pressedX >= this.targetCenterX - targetSizeHalfWidthPx &&
                this.pressedX <= this.targetCenterX + targetSizeHalfWidthPx &&
                this.pressedY >= this.targetCenterY - targetSizeHalfHeightPx &&
                this.pressedY <= this.targetCenterY + targetSizeHalfHeightPx
            const isRectangleClickInTargetElementWithTolerance = this.pressedX >= this.targetCenterX - targetSizeHalfWidthPx - Config.clickTolerance(this.amplitude) &&
                this.pressedX <= this.targetCenterX + targetSizeHalfWidthPx + Config.clickTolerance(this.amplitude) &&
                this.pressedY >= this.targetCenterY - targetSizeHalfHeightPx - Config.clickTolerance(this.amplitude) &&
                this.pressedY <= this.targetCenterY + targetSizeHalfHeightPx + Config.clickTolerance(this.amplitude)

            // Determines click in target circle
            this.distanceToTargetCenter = Math.sqrt((this.pressedX - this.targetCenterX) ** 2 + (this.pressedY - this.targetCenterY) ** 2);
            const targetSizePx = mm2px(this.targetWidth); // todo vereinigen mit start
            const isCircleClickInTargetElement = this.distanceToTargetCenter < targetSizePx / 2;
            const isCircleClickInTargetElementWithTolerance = this.distanceToTargetCenter < (targetSizePx + Config.clickTolerance(this.amplitude)) / 2;
            console.log("Click in circle? " + isCircleClickInTargetElement + " / " + isCircleClickInTargetElementWithTolerance + " / " + isRectangleClickInTargetElement)

            if (this.startClicked && !this.isTargetClicked) {
                this.endTimeClickStartToEnd = performance.now(); // Determines the time between start and target click

                // Determines the target touchDown and touchUp position
                this.targetClickedPostitionXTouchDown = this.touchDownPositionX;
                this.targetClickedPositionYTouchDown = this.touchDownPositionY;
                this.targetClickedPositionXTouchUp = this.touchUpPositionX;
                this.targetClickedPositionYTouchUp = this.touchUpPositionY;
                this.targetTimeTouchDownToTouchUpMs = this.getTouchDownTouchUpTimeDifference();

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
                    console.log("Click was in " + Config.clickTolerance(this.amplitude) + "click tolerance")
                    this.isMiss = true;
                    this.missAmount++;
                    this.missInToleranceAmount++;
                    if (Config.isMissSkipped) {
                        if (Config.reAddMisses) {
                            this.currentBlock.reAddTrial(this.trialNumber);
                        }
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

        /*
        Hinweis zu Clickamount / Missamount
        - 2 Clicks sind wenn von Start zu Ende geklickt wird
        - Misses gibt es erst, wenn Start geklickt wurde, davor gibt es nur Clicks (keine Misses)
         */
    }

    handleMouseDown(event) {
        this.touchDownPositionX = event.clientX;
        this.touchDownPositionY = event.clientY;
        this.touchDownTime = performance.now();
    }

    handleMouseUp(event) {
        this.touchUpPositionX = event.clientX;
        this.touchUpPositionY = event.clientY;
        this.touchUpTime = performance.now();
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
        console.log(`Information about click: Click distance to start center: ${this.clickDistanceToStartCenter} | Click distance to target center: ${this.distanceToTargetCenter} | isMiss? ${this.isMiss} | Miss Amount: ${this.missAmount} | Miss in tolerance: ${this.missInToleranceAmount} | Click tolerance: ${Config.clickTolerance(this.amplitude)}`);
        console.log(`Information about times: StartTouchDownToTouchUpTime: ${this.startTimeTouchDownToTouchUpMs} | TargetTouchDownToTouchUpTime: ${this.targetTimeTouchDownToTouchUpMs}`)
    }

    // TODO check size bei circle
    saveTrialData() {
        this.takenTimeToClickFromStartToEndMs = this.endTimeClickStartToEnd - this.startTimeStartToEndClick; // TODO falsche methode

        this.dataRecorder.addDataRow([this.serialNumber, this.trialNumber, this.trialId, this.trialCategory, this.blockNumber, this.username, this.shape, this.intDevice,
            this.amplitude, this.startSize, this.targetWidth, this.targetHeight, this.trialDirection, this.trialClockAngle,
            this.startCenterX, this.startCenterY, this.targetCenterX, this.targetCenterY, this.startClickedPostitionXTouchDown, this.startClickedPositionYTouchDown,
            this.startClickedPositionXTouchUp, this.startClickedPositionYTouchUp, this.targetClickedPostitionXTouchDown, this.targetClickedPositionYTouchDown,
            this.targetClickedPositionXTouchUp, this.targetClickedPositionYTouchUp, this.clickDistanceToStartCenter,
            this.distanceToTargetCenter, this.isMiss, this.missAmount, this.missInToleranceAmount, this.clicksAmount, this.takenTimeToClickFromStartToEndMs,
            this.startTimeTouchDownToTouchUpMs, this.targetTimeTouchDownToTouchUpMs]);

        console.log(this.dataRecorder.getDataArray());
        this.dataRecorder.generateCsvDownloadLink(false);
    }

    getTouchDownTouchUpTimeDifference() {
        return this.touchUpTime - this.touchDownTime;
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
            " | Trial Category: " +
            this.trialCategory +
            " | Block Number: " +
            this.blockNumber +
            " | Shape: " +
            this.shape +
            " | Interaction Device: " +
            this.intDevice +
            " | Start Size: " +
            this.startSize +
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

