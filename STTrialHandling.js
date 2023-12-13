class STTrialHandling {
    constructor(trial, currentBlock, trialNumber, serialNumber, dataRecorder, username, onTargetClicked) {
        this.trial = trial;
        this.blockNumber = currentBlock.getBlockNumber();
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
        this.repetitions = this.trial.repetitions;
        this.trialClockAngle = this.trial.trialClockAngle;
        this.trialDirection = this.trial.trialDirection;
        this.amplitude = this.trial.amplitude;
        this.startSize = this.trial.startSize;
        this.targetWidth = this.trial.targetWidth;
        this.targetHeight = this.trial.targetHeight;
        this.trialId = this.trial.trialId;
        this.intDevice = Config.intDevice;
        this.trialCategory = this.trial.trialCategory;
        this.trialGetsRepeated = false;

        this.clicksAmount = 0;          // determines the amount of clicks until the trial was finished
        this.missAmountAfterStartClick = 0;            // determines the overall miss amount until the target rectangle was clicked (also in tolerance incremented)
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
        this.targetElement = new ElementDrawer(context, this.targetCenterX, this.targetCenterY, this.targetWidthPx, this.targetHeightPx, this.shape);
        this.targetElement.drawTargetElement();

        // Determines which methods will be used to retrieve click position
        this.addClickListener();
        this.printToConsole();
    }

    addClickListener() {
        if (this.intDevice === "mouse") {
            document.addEventListener("mousedown", this.handleMouseDown);
            document.addEventListener("mouseup", this.handleMouseUp);
        } else if (this.intDevice === "touch") {
            document.addEventListener("touchstart", this.handleTouchStart); // Used for mobile touch
            document.addEventListener("touchend", this.handleTouchStop); // Used for mobile touch
        } else {
            console.error(`No intDevice with the name ${this.intDevice} specified`);
            alert(`No intDevice (${this.intDevice}) specified!`)
        }
    }

    setUpCanvas() {
        // Defines canvas
        let canvas = document.getElementById("trialCanvas");

        // Calculates width/height of window
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

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

    handleCanvasClick() {
        this.clicksAmount++;

        if (!this.startClicked) {
            this.handleStartClick();
        } else {
            this.handleTargetClick();
        }
    }

    handleStartClick() {
        this.clickDistanceToStartCenterTouchDown = Math.sqrt((this.touchDownClickPositionX - this.startCenterX) ** 2 + (this.touchDownClickPositionY - this.startCenterY) ** 2);
        this.clickDistanceToStartCenterTouchUp = Math.sqrt((this.touchUpClickPositionX - this.startCenterX) ** 2 + (this.touchUpClickPositionY - this.startCenterY) ** 2);

        // If click was in the start object
        if (this.isClickInStartElement(true) && this.isClickInStartElement(false)) {
            // Determines the start touchDown and touchUp position
            this.startClickedPostitionXTouchDown = this.touchDownClickPositionX;
            this.startClickedPositionYTouchDown = this.touchDownClickPositionY;
            this.startClickedPositionXTouchUp = this.touchUpClickPositionX;
            this.startClickedPositionYTouchUp = this.touchUpClickPositionY;
            this.startTimeTouchDownToTouchUpMs = this.getTouchDownTouchUpTimeDifference();

            this.startTimeStartToEndClick = performance.now();

            // Clicked on the start
            this.targetElement.highlight();
            this.startClicked = true;
        }
    }

    isClickInStartElement(isDown) {
        let clickPositionX;
        let clickPositionY;
        if (isDown) {
            clickPositionX = this.touchDownClickPositionX;
            clickPositionY = this.touchDownClickPositionY;
        } else {
            clickPositionX = this.touchUpClickPositionX;
            clickPositionY = this.touchUpClickPositionY
        }

        // Checks whether the click was in the start circle / rectangle
        if (this.shape === "rectangle") {
            const halfStartSize = this.startSizePx / 2;
            return clickPositionX >= this.startCenterX - halfStartSize &&
                clickPositionX <= this.startCenterX + halfStartSize &&
                clickPositionY >= this.startCenterY - halfStartSize &&
                clickPositionY <= this.startCenterY + halfStartSize
        } else if (this.shape === "circle") {
            // Todo not adjusted
            return this.clickDistanceToStartCenterTouchUp < this.startSizePx / 2;
        }
    }

    // Start was already clicked
    handleTargetClick() {
        this.clickDistanceToTargetCenterTouchDown = Math.sqrt((this.touchDownClickPositionX - this.targetCenterX) ** 2 + (this.touchDownClickPositionY - this.targetCenterY) ** 2);
        this.clickDistanceToTargetCenterTouchUp = Math.sqrt((this.touchUpClickPositionX - this.targetCenterX) ** 2 + (this.touchUpClickPositionY - this.targetCenterY) ** 2);
        if (Config.isDebug) console.log(`tD_X ${this.touchDownClickPositionX} | tD_Y ${this.touchDownClickPositionY} | tU_X ${this.touchUpClickPositionX} | tU_Y ${this.touchUpClickPositionY}`);

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
            if (Config.isDebug) console.log("Click Category: " + this.clickCategory);
        }
    }

    handleClickPossibilities() {
        if (this.isClickInTargetElement(false, true) && this.isClickInTargetElement(false, false)) { // up and down are in target
            this.clickCategory = "C1 - Down Target | Up Target";
            this.finishTrial(false);
        } else if (this.isClickInTargetElement(false, true) && this.isClickInTargetElement(true, false) && !this.isClickInTargetElement(false, false)) { // down target, up tolerance
            this.clickCategory = "C2 - Down Target | Up Inside Tolerance";
            this.handleClickInTolerance(false);
        } else if (this.isClickInTargetElement(false, true) && !this.isClickInTargetElement(true, false)) { // down target, up outside
            this.clickCategory = "C3 - Down Target | Up Outside Tolerance";
            this.finishTrial(false);
        } else if (this.isClickInTargetElement(true, true) && !this.isClickInTargetElement(false, true) && this.isClickInTargetElement(false, false)) { // down tolernace, up target
            this.clickCategory = "C4 - Down Inside Tolerance | Up Target";
            this.finishTrial(false);
        } else if (this.isClickInTargetElement(true, true) && !this.isClickInTargetElement(false, true) && this.isClickInTargetElement(true, false) && !this.isClickInTargetElement(false, false)) {
            this.clickCategory = "C5 - Down Inside Tolerance | Up Inside Tolerance";
            this.handleClickInTolerance(false);
        } else if (this.isClickInTargetElement(true, true) && !this.isClickInTargetElement(false, true) && !this.isClickInTargetElement(true, false)) {
            this.clickCategory = "C6 - Down Inside Tolerance | Up Outside Tolerance";
            this.finishTrial(false);
        } else if (!this.isClickInTargetElement(true, true) && this.isClickInTargetElement(false, false)) {
            this.clickCategory = "C7 - Down Outside Tolerance | Up Target";
            this.finishTrial(true);
        } else if (!this.isClickInTargetElement(true, true) && this.isClickInTargetElement(true, false) && !this.isClickInTargetElement(false, false)) {
            this.clickCategory = "C8 - Down Outside Tolerance | Up Inside Tolerance";
            this.handleClickInTolerance(true);
        } else if (!this.isClickInTargetElement(true, true) && !this.isClickInTargetElement(true, false)) {
            this.clickCategory = "C9 - Down Outside Tolerance | Up Outside";
            this.finishTrial(true);
        } else {
            this.trialCategory = "C10 - Unhandled";
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

    // TODO rework
    handleClickInTolerance(needsToBeRepeated) {
        this.isMiss = true;
        this.missAmountAfterStartClick++;
        this.missInToleranceAmount++;
        // TODO
        /*        if (Config.isMissSkipped) {
                    if (Config.reAddClicksInTolerance) {
                        this.currentBlock.reAddTrial(this.trialNumber);
                    }
                    this.finishTrial();
                }*/
        this.finishTrial(needsToBeRepeated);
    }

    finishTrial(needsToBeRepeated) {
        this.trialGetsRepeated = needsToBeRepeated;         // Flag if trial will be repeated due to fail
        this.onTargetClicked(needsToBeRepeated);
        if (Config.isDebug) this.printTrial();
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
        console.log(`Information about click position: StartTouchDown: X=${this.startClickedPostitionXTouchDown} Y=${this.startClickedPositionYTouchDown}, StartTouchUp: X=${this.startClickedPositionXTouchUp} Y=${this.startClickedPositionYTouchUp}, TargetTouchDown: X=${this.targetClickedPostitionXTouchDown} Y=${this.targetClickedPositionYTouchDown}, TargetTouchUp: X=${this.targetClickedPositionXTouchUp} Y=${this.targetClickedPositionYTouchUp} | Distance between TargetTouchUp/Down: ${this.clickDistanceBetweenTargetTouchDownTouchUp} | Click Category: ${this.clickCategory}`);
        console.log(`Information about click: Click distance to start center: (down/up) ${this.clickDistanceToStartCenterTouchDown} / ${this.clickDistanceToStartCenterTouchUp}  | Click distance to target center: (down/up) ${this.clickDistanceToTargetCenterTouchDown} / ${this.clickDistanceToTargetCenterTouchUp} | isMiss? ${this.isMiss} | Miss Amount: ${this.missAmountAfterStartClick} | Miss in tolerance: ${this.missInToleranceAmount} | Click tolerance: ${this.clickTolerance}`);
        console.log(`Information about times: StartTouchDownToTouchUpTime: ${this.startTimeTouchDownToTouchUpMs} | TargetTouchDownToTouchUpTime: ${this.targetTimeTouchDownToTouchUpMs}`)
    }

    // TODO check size bei circle
    saveTrialData() {
        this.dataRecorder.addDataRow([this.serialNumber, this.blockNumber, this.trialNumber, this.trialId, this.trialCategory, this.trialGetsRepeated, this.clickCategory, this.repetitions, this.username, this.shape, this.intDevice,
            getPPI(), get1MMInPx(), getWindowInnerWidth(), getWindowInnerHeight(),
            this.amplitude, mm2px(this.amplitude), this.startSize, mm2px(this.startSize), this.targetWidth, mm2px(this.targetWidthPx), this.targetHeight, mm2px(this.targetHeight), this.trialDirection, this.trialClockAngle,
            this.startCenterX, this.startCenterY, this.targetCenterX, this.targetCenterY, this.startClickedPostitionXTouchDown, this.startClickedPositionYTouchDown,
            this.startClickedPositionXTouchUp, this.startClickedPositionYTouchUp, this.targetClickedPostitionXTouchDown, this.targetClickedPositionYTouchDown,
            this.targetClickedPositionXTouchUp, this.targetClickedPositionYTouchUp, this.clickDistanceBetweenTargetTouchDownTouchUp, this.clickDistanceToStartCenterTouchDown, this.clickDistanceToStartCenterTouchUp,
            this.clickDistanceToTargetCenterTouchDown, this.clickDistanceToTargetCenterTouchUp, this.isMiss, this.missAmountAfterStartClick, this.missInToleranceAmount, this.clicksAmount, this.getTimeToClickFromStartToEndMs(),
            this.startTimeTouchDownToTouchUpMs, this.targetTimeTouchDownToTouchUpMs]);

        if (Config.isDebug) console.log(this.dataRecorder.getDataArray());
        if (Config.sendDataToServer) this.dataRecorder.publishCsvToServer();
        this.dataRecorder.generateCsvDownloadLink(false);
    }

    getTouchDownTouchUpTimeDifference() {
        return this.touchUpTime - this.touchDownTime;
    }

    getTimeToClickFromStartToEndMs() {
        return this.endTimeClickStartToEnd - this.startTimeStartToEndClick;
    }

    printToConsole() {
        console.log(`Information from Drawing: Username: ${this.username} | Trial Number: ${this.trialNumber} | Trial ID: ${this.trialId} | Trial Category: ${this.trialCategory} | Block Number: ${this.blockNumber} | Shape: ${this.shape} | Interaction Device: ${this.intDevice} | Start Size: ${this.startSize} | Amplitude: ${this.amplitude} | Target Width: ${this.targetWidth} | Target Height: ${this.targetHeight} | Trail Direction: ${this.trialDirection}`);
    }


    /*
    Hinweis zu Clickamount / missAmountAfterStartClick
    - 2 Clicks sind wenn von Start zu Ende geklickt wird
    - Misses gibt es erst, wenn Start geklickt wurde, davor gibt es nur Clicks (keine Misses)
     */
}

