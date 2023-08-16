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
        this.rectSize = rectSize;
        this.trialId = trial.trialId;
        this.trialDirection = trial.trialDirection;
        this.onTargetClicked = onTargetClicked;
        this.handleCanvasClick = this.handleCanvasClick.bind(this);
        this.trialNumber = trialNumber;
        this.intDevice = trial.intDevice;
        this.dataRecorder = dataRecorder;
        this.username = username;

        this.isMiss = false;
        this.clicks = 0;
        this.missAmount = 0;
    }

    initializeVariables(canvas) {
        const canvasCenterX = canvas.width / 2;
        const canvasCenterY = canvas.height / 2;
        const amplitudePx = mm2px(this.amplitude);
        const angle = (2 * Math.PI) / this.numRects;

        // Coordinates of the start center point
        this.startX = canvasCenterX + amplitudePx * Math.cos(this.startIndex * angle);
        this.startY = canvasCenterY + amplitudePx * Math.sin(this.startIndex * angle);

        this.startSizePx = mm2px(this.startSize); // size of start element (it's currently always a*a)

        // Coordinates of the target center point
        this.targetX = canvasCenterX + amplitudePx * Math.cos(this.targetIndex * angle);
        this.targetY = canvasCenterY + amplitudePx * Math.sin(this.targetIndex * angle);

        // console.log("StartX = " + this.startX + " startY = " + this.startY + " targetX = " + this.targetX + " targetY = " + this.targetY)
    }

    showRects() {
        // Defines canvas
        let canvasOld = document.getElementById("trialCanvas");
        const canvas = this.removeAllEventListeners(canvasOld) // otherwise multiple clicks will be registered
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
        const rectX = this.startX - this.startSizePx / 2;
        const rectY = this.startY - this.startSizePx / 2;

        // console.log("Angle = " + angle + " startX = " + startX + " startY = " + startY + " rectX = " + rectX + " rectY =" + rectY);

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
            context.arc(this.startX, this.startY, this.startSizePx / 2, 0, 2 * Math.PI);
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
        const targetRectX = this.targetX - targetWidthPx / 2;
        const targetRectY = this.targetY - targetHeightPx / 2;

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
            context.arc(this.targetX, this.targetY, targetSize / 2, 0, 2 * Math.PI);
            context.stroke();
            context.fill();
        } else {
            alert("No shape as " + this.shape + " is registered!")
            console.error("No shape with the name " + this.shape + " registered");
        }
        this.printToConsole(); // todo
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
        this.clicks++;

        const targetWidthPx = mm2px(this.targetWidth); // Width of the target rectangle
        const targetHeightPx = mm2px(this.targetHeight); // Height of the target rectangle


        const halfWidth = this.startSizePx / 2;
        const isRectangleClickInStartElement = this.pressedX >= this.startX - halfWidth &&
            this.pressedX <= this.startX + halfWidth &&
            this.pressedY >= this.startY - halfWidth &&
            this.pressedY <= this.startY + halfWidth
        const isCircleClickInStartElement = this.distanceToStartCenter < this.startSizePx / 2;
        // console.log(isRectangleClickInStartElement + " / " + isCircleClickInStartElement);

        // TODO currently only rectangle
        if (!this.startClicked && isRectangleClickInStartElement) {
            this.startClickedPositionX = this.pressedX;
            this.startClickedPositionY = this.pressedY;
            this.distanceToStartCenter = Math.sqrt((this.pressedX - this.startX) ** 2 + (this.pressedY - this.startY) ** 2);
            this.timeStart = performance.now();

            // Clicked on the start
            context.fillStyle = Config.targetElementSelectionStyle;
            context.beginPath(); // removes previous drawing operations

            if (this.shape === "rectangle") {
                context.fillRect(this.targetX - targetWidthPx / 2, this.targetY - targetHeightPx / 2, targetWidthPx, targetHeightPx);
            } else if (this.shape === "circle") {
                const startSizePx = mm2px(this.startSize) / 2;
                context.arc(this.startX, this.startY, startSizePx, 0, 2 * Math.PI);
                context.fill();
            }
            this.startClicked = true;
        } else {
            // Clicked outside the start
            // Target Size of rect or circle
            const targetSize = this.shape === "rectangle"
                ? Math.max(targetWidthPx, targetHeightPx)
                : targetWidthPx / 2;
            const distanceToTargetCenter = Math.sqrt((this.pressedX - this.targetX) ** 2 + (this.pressedY - this.targetY) ** 2);

            const targetSizeHalfWidth = targetWidthPx / 2;
            const targetSizeHalfHeight = targetHeightPx / 2;

            const isRectangleClickInTargetElement = this.pressedX >= this.targetX - targetSizeHalfWidth &&
                this.pressedX <= this.targetX + targetSizeHalfWidth &&
                this.pressedY >= this.targetY - targetSizeHalfHeight &&
                this.pressedY <= this.targetY + targetSizeHalfHeight
            const isRectangleClickInTargetElementWithTolerance = this.pressedX >= this.targetX - targetSizeHalfWidth - Config.clickTolerancePx &&
                this.pressedX <= this.targetX + targetSizeHalfWidth + Config.clickTolerancePx &&
                this.pressedY >= this.targetY - targetSizeHalfHeight - Config.clickTolerancePx &&
                this.pressedY <= this.targetY + targetSizeHalfHeight + Config.clickTolerancePx

            // console.log(isRectangleClickInStartElement)

            // TODO only works for rectangles
            if (this.startClicked && !this.isTargetClicked) {
                this.targetClickedPositionX = this.pressedX;
                this.targetClickedPositionY = this.pressedY;
                this.distanceToTargetCenter = Math.sqrt((this.pressedX - this.targetX) ** 2 + (this.pressedY - this.targetY) ** 2);
                this.timeEnd = performance.now(); // todo check ob passt

                if (isRectangleClickInTargetElement) {
                    console.log("Click was inside the element. Misses = " + this.missAmount);
                    this.finishTrial()
                } else if (isRectangleClickInTargetElementWithTolerance) {
                    console.log("Click was in " + Config.clickTolerancePx + "px click tolerance")
                    this.isMiss = true;
                    this.missAmount++;
                    if (Config.isMissSkipped) {
                        this.finishTrial();
                    } else {
                        // TODO message to do again?
                    }
                } else {
                    console.log("Click was not in tolerance")
                }
            }
        }
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
        console.log(`Information about finished trial: Amplitude: ${this.amplitude} (${mm2px(this.amplitude)}px) | Coordinates of Start center point: X=${this.startX} Y=${this.startY} | Coordinates of Target center point: X=${this.targetX} Y=${this.targetY}`);

        // TODO blocknumber
        console.log(`Information about click: Clicked start position: X=${this.startClickedPositionX} Y=${this.startClickedPositionX} | Clicked target position: X=${this.targetClickedPositionX} Y=${this.targetClickedPositionY} | Click distance to start center: ${this.distanceToStartCenter} | Click distance to target center: ${this.distanceToTargetCenter} | isMiss? ${this.isMiss} | Miss Amount: ${this.missAmount} | Click tolerancePx: ${Config.clickTolerancePx}`);
    }

    saveTrialData() {
        this.takenTimeToClickMs = this.timeEnd - this.timeStart;
        this.takenTimeToClickS = (this.timeEnd - this.timeStart) / 1000;

        this.dataRecorder.addDataRow([this.trialNumber, this.trialId, this.username, this.shape, this.intDevice, this.startIndex, this.targetIndex,
            this.amplitude, mm2px(this.amplitude), this.startSize, this.targetWidth, this.targetHeight, this.trialDirection,
            this.startX, this.startY, this.targetX, this.targetY, this.startClickedPositionX, this.startClickedPositionY,
            this.targetClickedPositionX, this.targetClickedPositionY, this.distanceToStartCenter,
            this.distanceToTargetCenter, this.isMiss, this.missAmount, this.clicks, this.takenTimeToClickMs, this.takenTimeToClickS]);


        console.log(this.dataRecorder.getDataArray());
        this.dataRecorder.generateCSVDownloadLink();
    }

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

