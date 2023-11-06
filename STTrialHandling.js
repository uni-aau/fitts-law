class STTrialHandling {
    constructor(trial, currentBlock, blockNumber, trialNumber, serialNumber, dataRecorder, username, onTargetClicked) {
        this.trial = trial;
        this.currentBlock = currentBlock;
        this.blockNumber = blockNumber;
        this.trialNumber = trialNumber;
        this.serialNumber = serialNumber;
        this.dataRecorder = dataRecorder;
        this.username = username;
        this.onTargetClicked = onTargetClicked;

        this.handleCanvasClick = this.handleCanvasClick.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchStop = this.handleTouchStop.bind(this);

        this.initializeVariables();
        this.initializeVariablesInPixel()
    }

    initializeVariables() {
        this.shape = this.trial.shape;
        this.trialClockAngle = this.trial.trialClockAngle;
        this.trialDirection = this.trial.trialDirection;
        this.amplitude = this.trial.amplitude;
        this.startSize = this.trial.startSize;
        this.targetWidth = this.trial.targetWidth;
        this.targetHeight = this.trial.targetHeight;
        this.trialId = this.trial.trialId;
        this.intDevice = this.trial.intDevice;
        this.trialCategory = this.trial.trialCategory;

        this.clicksAmount = 0;          // determines the amount of clicks until the trial was finished
        this.missAmount = 0;            // determines the overall miss amount until the target rectangle was clicked (also in tolerance incremented)
        this.missInToleranceAmount = 0; // determines the misses that are in the tolerance range (relevant if skip at miss is disabled)
        this.isMiss = false;            // determines if the trial had a miss
        this.startClicked = false;
        this.isTargetClicked = false;
        this.clickTolerance = Config.clickTolerance(this.amplitude);
    }

    initializeVariablesInPixel() {
        this.targetWidthPx = mm2px(this.targetWidth);
        this.targetHeightPx = mm2px(this.targetHeight);
        this.startSizePx = mm2px(this.startSize); // size of start element (it's currently always a*a)

        // TargetHeight = TargetWidth at circle
        if (this.shape === "circle") {
            this.targetHeight = this.targetWidth
            this.targetHeightPx = this.targetWidthPx;
        }
    }

    showTrial() {
        const canvas = this.setUpCanvas();
        const context = canvas.getContext("2d");

        context.clearRect(0, 0, canvas.width, canvas.height);

        // Element drawing
        const startElement = new ElementDrawer(context, this.startCenterX, this.startCenterY, this.startSizePx, this.startSizePx, this.shape);
        startElement.drawStartElement();
        const targetElement = new ElementDrawer(context, this.targetCenterX, this.targetCenterY, this.targetWidthPx, this.targetHeightPx, this.shape);
        targetElement.drawTargetElement();

        // Determines which methods will be used to retrieve click position
        this.addClickListener();
        this.printToConsole();
    }

    addClickListener() {
        if (Config.intDevice === "mouse") {
            document.addEventListener("mousedown", this.handleMouseDown);
            document.addEventListener("mouseup", this.handleMouseUp);
        } else if (Config.intDevice === "touch") {
            document.addEventListener("touchstart", this.handleTouchStart); // Used for mobile touch
            document.addEventListener("touchend", this.handleTouchStop); // Used for mobile touch
        } else {
            console.error(`No intDevice with the name ${this.intDevice} specified`);
            alert(`No intDevice (${this.intDevice}) specified!`)
        }
    }

    setUpCanvas() {
        // Defines canvas
        let canvasOld = document.getElementById("trialCanvas");
        let canvas = this.removeAllEventListeners(canvasOld) // otherwise multiple clicksAmount will be registered

        // Calculates width/height of window
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // canvas.addEventListener("click", this.handleCanvasClick); // TODO

        this.initializeCanvasVariables(canvas)

        return canvas;
    }

    // Todo new canvas objekt?
    initializeCanvasVariables(canvas) {
        const canvasCenterX = canvas.width / 2;
        const canvasCenterY = canvas.height / 2;
        const amplitudePx = mm2px(this.amplitude);
        const startAngle = this.trialClockAngle;
        const targetAngle = (startAngle + 180) % 360; // opposite direction of angle
        const startAngleRad = (startAngle * Math.PI) / 180;
        const targetAngleRad = (targetAngle * Math.PI) / 180;

        if (Config.randomTrialPlacement) {
            // Determines the minWidth & maxWidth | minHeight & maxHeight
            const randomValueX = this.getRandomValueX(startAngle, amplitudePx, canvas);
            const randomValueY = this.getRandomValueY(startAngle, amplitudePx, canvas); // Determines min/max random height

            this.startCenterX = randomValueX + amplitudePx * Math.cos(startAngleRad);
            this.startCenterY = randomValueY + amplitudePx * Math.sin(startAngleRad);
            this.targetCenterX = randomValueX;
            this.targetCenterY = randomValueY;

            if (Config.isDebug) {
                console.log(`mW ${this.minWidth} | mW ${this.maxWidth} | mH ${this.minHeight} | maxH ${this.maxHeight}`)
                console.log(`CVW ${canvas.width} | CVH ${canvas.height} | ${canvasCenterX} | ${canvasCenterY} | RVX ${randomValueX} | RVY ${randomValueY} | A ${amplitudePx} | SCX ${this.startCenterX} | SCY ${this.startCenterY} | TCX ${this.targetCenterX} | TCY ${this.targetCenterY}`)
            }
        } else {
            this.startCenterX = canvasCenterX + (amplitudePx / 2) * Math.cos(startAngleRad);
            this.startCenterY = canvasCenterY + (amplitudePx / 2) * Math.sin(startAngleRad);
            this.targetCenterX = canvasCenterX + (amplitudePx / 2) * Math.cos(targetAngleRad);
            this.targetCenterY = canvasCenterY + (amplitudePx / 2) * Math.sin(targetAngleRad);
        }
    }

    getRandomValueX(startAngle, amplitudePx, canvas) {
        // Determines min/max random width
        if (startAngle < 90 || startAngle > 270) { // If target is left -> > amplitude at end distance
            this.minWidth = Config.randomTrialPlacementTolerance + this.targetWidthPx / 2;
            this.maxWidth = canvas.width - Config.randomTrialPlacementTolerance - amplitudePx - this.startSizePx / 2;
        } else if (startAngle > 90 && startAngle < 270) { // if target is right -> > amplitude at start distance
            this.minWidth = Config.randomTrialPlacementTolerance + amplitudePx + this.startSizePx / 2;
            this.maxWidth = canvas.width - Config.randomTrialPlacementTolerance - this.targetWidthPx / 2;
        } else { // if target is up (90) or down (270)
            this.minWidth = Config.randomTrialPlacementTolerance + this.targetWidthPx / 2
            this.maxWidth = canvas.width - Config.randomTrialPlacementTolerance - this.targetWidthPx / 2;
        }
        return Math.random() * (this.maxWidth - this.minWidth) + this.minWidth; // Calculates random value
    }

    getRandomValueY(startAngle, amplitudePx, canvas) {
        if (startAngle > 0 && startAngle < 180) { // If target is up
            this.minHeight = Config.randomTrialPlacementTolerance + this.targetHeightPx / 2;
            this.maxHeight = canvas.height - Config.randomTrialPlacementTolerance - this.targetHeightPx / 2 - amplitudePx;
        } else { // If target is down
            this.minHeight = Config.randomTrialPlacement + this.targetHeightPx / 2 + amplitudePx;
            this.maxHeight = canvas.height - Config.randomTrialPlacementTolerance - this.targetHeightPx / 2;
        }
        return Math.random() * (this.maxHeight - this.minHeight) + this.minHeight;
    }


    // Todo still necessary after change?
    removeAllEventListeners(element) {
        const clone = element.cloneNode(true);
        element.parentNode.replaceChild(clone, element);
        return clone;
    }

    handleCanvasClick() {
        const canvas = document.getElementById("trialCanvas");
        const context = canvas.getContext("2d");

        this.clicksAmount++;

        if (!this.startClicked) {
            this.handleStartClick(context);
        } else {
            this.handleTargetClick(context);
        }
    }

    handleStartClick(context) {
        this.clickDistanceToStartCenterTouchDown = Math.sqrt((this.touchDownClickPositionX - this.startCenterX) ** 2 + (this.touchDownClickPositionY - this.startCenterY) ** 2);
        this.clickDistanceToStartCenterTouchUp = Math.sqrt((this.touchUpClickPositionX - this.startCenterX) ** 2 + (this.touchUpClickPositionY - this.startCenterY) ** 2);

        // If click was in the start object
        if (this.isClickInStartElement()) {
            // Determines the start touchDown and touchUp position
            this.startClickedPostitionXTouchDown = this.touchDownClickPositionX;
            this.startClickedPositionYTouchDown = this.touchDownClickPositionY;
            this.startClickedPositionXTouchUp = this.touchUpClickPositionX;
            this.startClickedPositionYTouchUp = this.touchUpClickPositionY;
            this.startTimeTouchDownToTouchUpMs = this.getTouchDownTouchUpTimeDifference();

            this.startTimeStartToEndClick = performance.now();

            // Clicked on the start
            context.fillStyle = Config.targetElementSelectionStyle;
            context.beginPath(); // removes previous drawing operations

            if (this.shape === "rectangle") {
                context.fillRect(this.targetCenterX - this.targetWidthPx / 2, this.targetCenterY - this.targetHeightPx / 2, this.targetWidthPx, this.targetHeightPx);
            } else if (this.shape === "circle") {
                context.arc(this.startCenterX, this.startCenterY, this.startSizePx / 2, 0, 2 * Math.PI);
                context.fill();
            }
            this.startClicked = true;
        }
    }

    isClickInStartElement() {
        // Checks whether the click was in the start circle / rectangle (TODO ansehen)
        if (this.shape === "rectangle") {
            const halfWidthPx = this.startSizePx / 2; // TODO
            return this.touchUpClickPositionX >= this.startCenterX - halfWidthPx &&
                this.touchUpClickPositionX <= this.startCenterX + halfWidthPx &&
                this.touchUpClickPositionY >= this.startCenterY - halfWidthPx &&
                this.touchUpClickPositionY <= this.startCenterY + halfWidthPx
        } else if (this.shape === "circle") {
            return this.clickDistanceToStartCenterTouchUp < this.startSizePx / 2;
        }
    }

    // Start was already clicked
    handleTargetClick() {
        this.clickDistanceToTargetCenterTouchDown = Math.sqrt((this.touchDownClickPositionX - this.targetCenterX) ** 2 + (this.touchDownClickPositionY - this.targetCenterY) ** 2);
        this.clickDistanceToTargetCenterTouchUp = Math.sqrt((this.touchUpClickPositionX - this.targetCenterX) ** 2 + (this.touchUpClickPositionY - this.targetCenterY) ** 2);
        console.debug(`${this.touchDownClickPositionX} | ${this.touchDownClickPositionY} | ${this.touchUpClickPositionX} | ${this.touchUpClickPositionY}`);

        if (this.startClicked && !this.isTargetClicked) {
            this.endTimeClickStartToEnd = performance.now(); // Determines the time between start and target click

            // Determines the target touchDown and touchUp position
            this.targetClickedPostitionXTouchDown = this.touchDownClickPositionX;
            this.targetClickedPositionYTouchDown = this.touchDownClickPositionY;
            this.targetClickedPositionXTouchUp = this.touchUpClickPositionX;
            this.targetClickedPositionYTouchUp = this.touchUpClickPositionY;
            this.targetTimeTouchDownToTouchUpMs = this.getTouchDownTouchUpTimeDifference();
            this.clickDistanceBetweenTargetTouchDownTouchUp = Math.sqrt((this.targetClickedPostitionXTouchDown - this.targetClickedPositionXTouchUp) ** 2 + (this.targetClickedPositionYTouchDown - this.targetClickedPositionYTouchUp) ** 2);

            this.handleClickPossibilities();
            console.log("Click Category: " + this.category);
        }
    }

    handleClickPossibilities() {
        if (this.isClickInTargetElement(false, true) && this.isClickInTargetElement(false, false)) { // up and down are in target
            this.category = "C1 - Down & Up Target";
            this.finishTrial()
        } else if (!this.isClickInTargetElement(true, true) && this.isClickInTargetElement(false, false)) { // down is outside of target, up is inside of target
            this.category = "C2 - Down Outside & Up Target";
            this.finishTrial()
        } else if (!this.isClickInTargetElement(true, true) && this.isClickInTargetElement(true, false)) { // down outside, up in tolerance
            this.category = "C4 - Down Outside & Up Tolerance";
            this.handleClickInTolerance();
        } else if (this.isClickInTargetElement(true, true) && this.isClickInTargetElement(false, false)) { //down tolerance, up target
            this.category = "C5 - Down Tolerance & Up Target";
            this.finishTrial();
        } else if (this.isClickInTargetElement(false, true) && this.isClickInTargetElement(true, false)) { // down target, up tolerance
            this.category = "C6 - Down Target & Up Tolerance"
            this.handleClickInTolerance();
        } else if (this.isClickInTargetElement(true, true) && this.isClickInTargetElement(true, false)) { // tolerance & tolerance
            this.category = "C3 - Down Tolerance & Up Tolerance";
            this.handleClickInTolerance();
        } else { // down & up outside
            this.category = "C7 - Down & Up Outside";
            this.missAmount++;
        }
    }

    // Determines if up or down click is in target or in tolerance
    isClickInTargetElement(withTolerance, isDown) {
        let clickPositionX;
        let clickPositionY;

        if (isDown) {
            clickPositionX = this.touchDownClickPositionX;
            clickPositionY = this.touchDownClickPositionY;
        } else { // isDown
            clickPositionX = this.touchUpClickPositionX;
            clickPositionY = this.touchUpClickPositionY;
        }

        if (this.shape === "rectangle") {
            const targetSizeHalfWidthPx = this.targetWidthPx / 2;
            const targetSizeHalfHeightPx = this.targetHeightPx / 2;
            if (!withTolerance) {
                return (clickPositionX >= this.targetCenterX - targetSizeHalfWidthPx &&
                    clickPositionX <= this.targetCenterX + targetSizeHalfWidthPx &&
                    clickPositionY >= this.targetCenterY - targetSizeHalfHeightPx &&
                    clickPositionY <= this.targetCenterY + targetSizeHalfHeightPx)
            } else {
                return (clickPositionX >= this.targetCenterX - targetSizeHalfWidthPx - this.clickTolerance &&
                    clickPositionX <= this.targetCenterX + targetSizeHalfWidthPx + this.clickTolerance &&
                    clickPositionY >= this.targetCenterY - targetSizeHalfHeightPx - this.clickTolerance &&
                    clickPositionY <= this.targetCenterY + targetSizeHalfHeightPx + this.clickTolerance)
            }
        } else if (this.shape === "circle") {
            // TODO not adjusted
            if (!withTolerance) return this.clickDistanceToTargetCenterTouchUp < this.targetWidthPx / 2;
            else return this.clickDistanceToTargetCenterTouchUp < (this.targetWidthPx + this.clickTolerance) / 2;
        }
        return false;
    }

    handleMouseDown(event) {
        this.touchDownClickPositionX = event.clientX;
        this.touchDownClickPositionY = event.clientY;
        this.touchDownTime = performance.now();
    }

    handleMouseUp(event) {
        this.touchUpClickPositionX = event.clientX;
        this.touchUpClickPositionY = event.clientY;
        this.touchUpTime = performance.now();
        this.handleCanvasClick();
    }

    handleTouchStart(event) {
        this.touchDownClickPositionX = event.touches[0].clientX;
        this.touchDownClickPositionY = event.touches[0].clientY;
        this.touchDownTime = performance.now();
    }

    handleTouchStop(event) {
        this.touchUpClickPositionX = event.changedTouches[0].clientX;
        this.touchUpClickPositionY = event.changedTouches[0].clientY;
        this.touchUpTime = performance.now();
        this.handleCanvasClick()
    }

    handleClickInTolerance() {
        this.isMiss = true;
        this.missAmount++;
        this.missInToleranceAmount++;
        if (Config.isMissSkipped) {
            if (Config.reAddMisses) {
                this.currentBlock.reAddTrial(this.trialNumber);
            }
            this.finishTrial();
        }
    }

    finishTrial() {
        this.onTargetClicked();
        this.printTrial();
        this.saveTrialData();
        this.isTargetClicked = true;
    }

    removeEventListeners() {
        if (this.intDevice === "mouse") {
            document.removeEventListener("mousedown", this.handleMouseDown);
            document.removeEventListener("mouseup", this.handleMouseUp);
        } else if (this.intDevice === "touch") {
            document.removeEventListener("touchstart", this.handleTouchStart);
            document.removeEventListener("touchend", this.handleTouchStop);
        }
    }

    printTrial() {
        console.log(`Information about finished trial: Amplitude: ${this.amplitude} (${mm2px(this.amplitude)}px) | Coordinates of Start center point: X=${this.startCenterX} Y=${this.startCenterY} | Coordinates of Target center point: X=${this.targetCenterX} Y=${this.targetCenterY}`);
        console.log(`Information about click position: StartTouchDown: X=${this.startClickedPostitionXTouchDown} Y=${this.startClickedPositionYTouchDown}, StartTouchUp: X=${this.startClickedPositionXTouchUp} Y=${this.startClickedPositionYTouchUp}, TargetTouchDown: X=${this.targetClickedPostitionXTouchDown} Y=${this.targetClickedPositionYTouchDown}, TargetTouchUp: X=${this.targetClickedPositionXTouchUp} Y=${this.targetClickedPositionYTouchUp} | Distance between TargetTouchUp/Down: ${this.clickDistanceBetweenTargetTouchDownTouchUp}`);
        console.log(`Information about click: Click distance to start center: (down/up) ${this.clickDistanceToStartCenterTouchDown} / ${this.clickDistanceToStartCenterTouchUp}  | Click distance to target center: (down/up) ${this.clickDistanceToTargetCenterTouchDown} / ${this.clickDistanceToTargetCenterTouchUp} | isMiss? ${this.isMiss} | Miss Amount: ${this.missAmount} | Miss in tolerance: ${this.missInToleranceAmount} | Click tolerance: ${this.clickTolerance}`);
        console.log(`Information about times: StartTouchDownToTouchUpTime: ${this.startTimeTouchDownToTouchUpMs} | TargetTouchDownToTouchUpTime: ${this.targetTimeTouchDownToTouchUpMs}`)
    }

    // TODO check size bei circle
    saveTrialData() {
        this.dataRecorder.addDataRow([this.serialNumber, this.trialNumber, this.trialId, this.trialCategory, this.blockNumber, this.username, this.shape, this.intDevice,
            getPPI(), get1MMInPx(), getWindowInnerWidth(), getWindowInnerHeight(),
            this.amplitude, this.startSize, this.targetWidth, this.targetHeight, this.trialDirection, this.trialClockAngle,
            this.startCenterX, this.startCenterY, this.targetCenterX, this.targetCenterY, this.startClickedPostitionXTouchDown, this.startClickedPositionYTouchDown,
            this.startClickedPositionXTouchUp, this.startClickedPositionYTouchUp, this.targetClickedPostitionXTouchDown, this.targetClickedPositionYTouchDown,
            this.targetClickedPositionXTouchUp, this.targetClickedPositionYTouchUp, this.clickDistanceBetweenTargetTouchDownTouchUp, this.clickDistanceToStartCenterTouchDown, this.clickDistanceToStartCenterTouchUp,
            this.clickDistanceToTargetCenterTouchDown, this.clickDistanceToTargetCenterTouchUp, this.isMiss, this.missAmount, this.missInToleranceAmount, this.clicksAmount, this.getTimeToClickFromStartToEndMs(),
            this.startTimeTouchDownToTouchUpMs, this.targetTimeTouchDownToTouchUpMs]);

        console.log(this.dataRecorder.getDataArray());
        if (Config.sendDataToServer) this.dataRecorder.publishCsvToServer();
        this.dataRecorder.generateCsvDownloadLink(false);
    }

    getTouchDownTouchUpTimeDifference() {
        return this.touchUpTime - this.touchDownTime;
    }

    getTimeToClickFromStartToEndMs() {
        return this.endTimeClickStartToEnd - this.startTimeStartToEndClick;
    }

    // TODO
    /*
    - Clickhandling in eigener Klasse
    - Misses -> TargetMisses
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


    /*
    Hinweis zu Clickamount / Missamount
    - 2 Clicks sind wenn von Start zu Ende geklickt wird
    - Misses gibt es erst, wenn Start geklickt wurde, davor gibt es nur Clicks (keine Misses)
     */
}
