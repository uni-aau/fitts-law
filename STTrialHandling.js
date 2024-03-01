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

        this.totalClicksAmount = 0;             // determines the amount of clicks until the trial was finished
        this.clicksAmountAfterStartClick = 0;   // determines the amount of clicks which will be fetched after start element was clicked
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

        if (Config.drawCanvasGrid) ElementDrawer.drawGrid(canvas.width, canvas.height, context);
        if (Config.drawToleranceElement) new ElementDrawer(context, this.targetCenterX, this.targetCenterY, this.clickTolerance, this.clickTolerance).drawCircle();

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
            const randomValueX = this.getRandomValueX(startAngle, amplitudePx, canvas);  // Determines random width within canvas
            const randomValueY = this.getRandomValueY(startAngle, amplitudePx, canvas); // Determines random height within canvas

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
        const startAngleRad = (startAngle * Math.PI) / 180;
        let distanceX = Math.abs(Math.cos(startAngleRad) * amplitudePx);

        let randomTrialPlacementToleranceXLeftPx = mm2px(Config.randomTrialPlacementToleranceXLeft);
        let randomTrialPlacementToleranceXRightPx = mm2px(Config.randomTrialPlacementToleranceXRight);

        // Determines min/max random width
        // Start has random value +/- x amplitude distance | Target only has random value
        if (startAngle < 90 || startAngle > 270) { // If target is left
            // min - 0 + Tolerance + targetWidth/2 (until middlepoint)
            // max - At canvas without tolerance, x distance of amplitude and startWidth/2 since start gets added amplitude
            this.minWidth = randomTrialPlacementToleranceXLeftPx + this.targetWidthPx / 2;
            this.maxWidth = canvas.width - randomTrialPlacementToleranceXRightPx - distanceX - this.startSizePx / 2;
        } else if (startAngle > 90 && startAngle < 270) { // if target is right
            this.minWidth = randomTrialPlacementToleranceXLeftPx + distanceX + this.startSizePx / 2; // startWidth/2
            this.maxWidth = canvas.width - randomTrialPlacementToleranceXRightPx - this.targetWidthPx / 2;
        } else { // if target is up (90) or down (270)
            this.minWidth = randomTrialPlacementToleranceXLeftPx + this.targetWidthPx / 2
            this.maxWidth = canvas.width - randomTrialPlacementToleranceXRightPx - this.targetWidthPx / 2;
        }

        if (this.minWidth > this.maxWidth) console.error(`Minimum Width (${this.minWidth}) > Maximum Width (${this.maxWidth}) for RandomX - Trial ID: ${this.trialId} | Trial Category: ${this.trialCategory}`);

        let randomValueX = Math.random() * (this.maxWidth - this.minWidth) + this.minWidth; // Calculates random value
        if (Config.isDebug) console.log("Minimum Width for RandomX: " + this.minWidth + " | Maximum Width for RandomX: " + this.maxWidth + " | Random Value X: " + randomValueX);

        return randomValueX;
    }

    getRandomValueY(startAngle, amplitudePx, canvas) {
        const startAngleRad = (startAngle * Math.PI) / 180;
        let distanceY = Math.abs(Math.sin(startAngleRad) * amplitudePx);

        let randomTrialPlacementToleranceYUpPx = mm2px(Config.randomTrialPlacementToleranceYUp);
        let randomTrialPlacementToleranceYDownPx = mm2px(Config.randomTrialPlacementToleranceYDown);

        // Start has random value + amplitude | Target only has random value
        if (startAngle > 0 && startAngle < 180) { // If target is up
            this.minHeight = randomTrialPlacementToleranceYUpPx + this.targetHeightPx / 2; // minHeight starts at y = 0
            // Start must be away from canvas max height at least startHeight/2 + amplitude + tolerance
            this.maxHeight = canvas.height - randomTrialPlacementToleranceYDownPx - this.startSizePx / 2 - distanceY;
        } else { // If target is down
            this.minHeight = randomTrialPlacementToleranceYUpPx + this.startSizePx / 2 + distanceY;
            this.maxHeight = canvas.height - randomTrialPlacementToleranceYDownPx - this.targetHeightPx / 2;
        }

        if (this.minHeight > this.maxHeight) console.error(`Minimum Height (${this.minHeight}) > Maximum Height (${this.maxHeight}) for RandomY - Trial ID: ${this.trialId} | Trial Category: ${this.trialCategory}`);

        let randomValueY = Math.random() * (this.maxHeight - this.minHeight) + this.minHeight;
        if (Config.isDebug) console.log("Minimum Height for RandomY: " + this.minHeight + " | Maximum Height for RandomY: " + this.maxHeight + " | Random Value Y: " + randomValueY);

        return randomValueY;
    }

    handleCanvasClick() {
        this.totalClicksAmount++;

        if (!this.startClicked) {
            this.handleStartClick();
        } else {
            this.clicksAmountAfterStartClick++;
            this.handleTargetClick();
        }
    }

    handleStartClick() {
        this.determineClickDistancesToStartCenter();

        // If click was in the start object
        if (this.isClickInStartElement(true) && this.isClickInStartElement(false)) {
            // Determines the start touchDown and touchUp position
            this.startClickedPostitionTouchDownX = this.touchDownClickPositionX;
            this.startClickedPositionTouchDownY = this.touchDownClickPositionY;
            this.startClickedPositionTouchUpX = this.touchUpClickPositionX;
            this.startClickedPositionTouchUpY = this.touchUpClickPositionY;
            this.startTimeTouchDownToTouchUpMs = this.getTouchDownTouchUpTimeDifference();

            this.startTimeStartToEndClick = performance.now();

            // Clicked on the start
            this.targetElement.highlight();
            this.startClicked = true;
        }
    }

    determineClickDistancesToStartCenter() {
        this.clickDistanceToStartCenterTouchUpX = Math.abs(this.touchUpClickPositionX - this.startCenterX);
        this.clickDistanceToStartCenterTouchUpY = Math.abs(this.touchUpClickPositionY - this.startCenterY);
        this.clickDistanceToStartCenterTouchUpXY = Math.sqrt((this.touchUpClickPositionX - this.startCenterX) ** 2 + (this.touchUpClickPositionY - this.startCenterY) ** 2);

        this.clickDistanceToStartCenterTouchDownX = Math.abs(this.touchDownClickPositionX - this.startCenterX);
        this.clickDistanceToStartCenterTouchDownY = Math.abs(this.touchDownClickPositionY - this.startCenterY);
        this.clickDistanceToStartCenterTouchDownXY = Math.sqrt((this.touchDownClickPositionX - this.startCenterX) ** 2 + (this.touchDownClickPositionY - this.startCenterY) ** 2);
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
            return this.clickDistanceToStartCenterTouchUpXY < this.startSizePx / 2;
        }
    }

    // Start was already clicked
    handleTargetClick() {
        this.determineClickDistancesToTargetCenter();

        if (this.startClicked && !this.isTargetClicked) {
            this.endTimeClickStartToEnd = performance.now(); // Determines the time between start and target click

            // Determines the target touchDown and touchUp position
            this.targetClickedPostitionTouchDownX = this.touchDownClickPositionX;
            this.targetClickedPositionTouchDownY = this.touchDownClickPositionY;
            this.targetClickedPositionTouchUpX = this.touchUpClickPositionX;
            this.targetClickedPositionTouchUpY = this.touchUpClickPositionY;
            this.targetTimeTouchDownToTouchUpMs = this.getTouchDownTouchUpTimeDifference();
            this.clickDistanceBetweenTargetTouchDownTouchUp = Math.sqrt((this.targetClickedPostitionTouchDownX - this.targetClickedPositionTouchUpX) ** 2 + (this.targetClickedPositionTouchDownY - this.targetClickedPositionTouchUpY) ** 2);

            this.handleClickPossibilities();
            if (Config.isDebug) console.log("Click Category: " + this.clickCategory);
        }
    }

    determineClickDistancesToTargetCenter() {
        this.clickDistanceToTargetCenterTouchDownX = Math.abs(this.touchDownClickPositionX - this.targetCenterX);
        this.clickDistanceToTargetCenterTouchDownY = Math.abs(this.touchDownClickPositionY - this.targetCenterY);
        this.clickDistanceToTargetCenterTouchDownXY = Math.sqrt((this.touchDownClickPositionX - this.targetCenterX) ** 2 + (this.touchDownClickPositionY - this.targetCenterY) ** 2);

        this.clickDistanceToTargetCenterTouchUpX = Math.abs(this.touchUpClickPositionX - this.targetCenterX);
        this.clickDistanceToTargetCenterTouchUpY = Math.abs(this.touchUpClickPositionY - this.targetCenterY);
        this.clickDistanceToTargetCenterTouchUpXY = Math.sqrt((this.touchUpClickPositionX - this.targetCenterX) ** 2 + (this.touchUpClickPositionY - this.targetCenterY) ** 2);

        if (Config.isDebug) console.log(`tD_X ${this.touchDownClickPositionX} | tD_Y ${this.touchDownClickPositionY} | tU_X ${this.touchUpClickPositionX} | tU_Y ${this.touchUpClickPositionY}`);
    }

    handleClickPossibilities() {
        if (this.isClickInTargetElement(false, true) && this.isClickInTargetElement(false, false)) { // up and down are in target
            this.clickCategory = "C1 - Down Target | Up Target";
            this.finishTrial(false);
        } else if (this.isClickInTargetElement(false, true) && this.isClickInTargetElement(true, false) && !this.isClickInTargetElement(false, false)) { // down target, up tolerance
            this.clickCategory = "C2 - Down Target | Up Inside Tolerance";
            this.finishTrial(false);
        } else if (this.isClickInTargetElement(false, true) && !this.isClickInTargetElement(true, false)) { // down target, up outside
            this.clickCategory = "C3 - Down Target | Up Outside Tolerance";
            this.finishTrial(false);
        } else if (this.isClickInTargetElement(true, true) && !this.isClickInTargetElement(false, true) && this.isClickInTargetElement(false, false)) { // down tolernace, up target
            this.clickCategory = "C4 - Down Inside Tolerance | Up Target";
            this.finishTrial(false);
        } else if (this.isClickInTargetElement(true, true) && !this.isClickInTargetElement(false, true) && this.isClickInTargetElement(true, false) && !this.isClickInTargetElement(false, false)) {
            this.clickCategory = "C5 - Down Inside Tolerance | Up Inside Tolerance";
            this.finishTrial(false);
        } else if (this.isClickInTargetElement(true, true) && !this.isClickInTargetElement(false, true) && !this.isClickInTargetElement(true, false)) {
            this.clickCategory = "C6 - Down Inside Tolerance | Up Outside Tolerance";
            this.finishTrial(false);
        } else if (!this.isClickInTargetElement(true, true) && this.isClickInTargetElement(false, false)) {
            this.clickCategory = "C7 - Down Outside Tolerance | Up Target";
            this.finishTrial(true);
        } else if (!this.isClickInTargetElement(true, true) && this.isClickInTargetElement(true, false) && !this.isClickInTargetElement(false, false)) {
            this.clickCategory = "C8 - Down Outside Tolerance | Up Inside Tolerance";
            this.finishTrial(true);
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
        let clickDistanceToTargetCenter;

        if (isDown) {
            clickPositionX = this.touchDownClickPositionX;
            clickPositionY = this.touchDownClickPositionY;
            clickDistanceToTargetCenter = this.clickDistanceToTargetCenterTouchDownXY;
        } else { // touchUp
            clickPositionX = this.touchUpClickPositionX;
            clickPositionY = this.touchUpClickPositionY;
            clickDistanceToTargetCenter = this.clickDistanceToTargetCenterTouchUpXY;
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
                return clickDistanceToTargetCenter < this.clickTolerance;
            }
        } else if (this.shape === "circle") {
            // TODO not adjusted
            if (!withTolerance) return this.clickDistanceToTargetCenterTouchUpXY < this.targetWidthPx / 2;
            else return this.clickDistanceToTargetCenterTouchUpXY < (this.targetWidthPx + this.clickTolerance) / 2;
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

    finishTrial(needsToBeRepeated) {
        this.trialGetsRepeated = Config.repeatTrial ? needsToBeRepeated : false;         // Flag if trial will be repeated due to fail -> If repeatTrial in config is false, no trials get repeated
        this.onTargetClicked(this.trialGetsRepeated);
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
        console.log(`Information about click position: StartTouchDown: X=${this.startClickedPostitionTouchDownX} Y=${this.startClickedPositionTouchDownY}, StartTouchUp: X=${this.startClickedPositionTouchUpX} Y=${this.startClickedPositionTouchUpY}, TargetTouchDown: X=${this.targetClickedPostitionTouchDownX} Y=${this.targetClickedPositionTouchDownY}, TargetTouchUp: X=${this.targetClickedPositionTouchUpX} Y=${this.targetClickedPositionTouchUpY} | Distance between TargetTouchUp/Down: ${this.clickDistanceBetweenTargetTouchDownTouchUp} | Click Category: ${this.clickCategory}`);
        console.log(`Information about click: Click distance to start center: (down/up) ${this.clickDistanceToStartCenterTouchDownXY} / ${this.clickDistanceToStartCenterTouchUpXY}  | Click distance to target center: (down/up) ${this.clickDistanceToTargetCenterTouchDownXY} / ${this.clickDistanceToTargetCenterTouchUpXY}| Click tolerance: ${this.clickTolerance}`);
        console.log(`Information about times: StartTouchDownToTouchUpTime: ${this.startTimeTouchDownToTouchUpMs} | TargetTouchDownToTouchUpTime: ${this.targetTimeTouchDownToTouchUpMs}`)
    }

    // TODO check size bei circle
    saveTrialData() {
        this.dataRecorder.addDataRow([this.serialNumber, Config.isTestSet, this.blockNumber, this.trialNumber, this.trialId, this.trialCategory, this.trialGetsRepeated, this.clickCategory, this.repetitions, this.username, this.shape, this.intDevice,
            getPPI(), get1MMInPx(), getWindowInnerWidth(), getWindowInnerHeight(),
            this.amplitude, mm2px(this.amplitude), this.startSize, mm2px(this.startSize), this.targetWidth, mm2px(this.targetWidthPx), this.targetHeight, mm2px(this.targetHeight), this.trialDirection, this.trialClockAngle,
            this.startCenterX, this.startCenterY, this.targetCenterX, this.targetCenterY, this.startClickedPostitionTouchDownX, this.startClickedPositionTouchDownY,
            this.startClickedPositionTouchUpX, this.startClickedPositionTouchUpY, this.targetClickedPostitionTouchDownX, this.targetClickedPositionTouchDownY,
            this.targetClickedPositionTouchUpX, this.targetClickedPositionTouchUpY, this.clickDistanceBetweenTargetTouchDownTouchUp,
            this.clickDistanceToStartCenterTouchDownXY, this.clickDistanceToStartCenterTouchDownX, this.clickDistanceToStartCenterTouchDownY,
            this.clickDistanceToStartCenterTouchUpXY, this.clickDistanceToStartCenterTouchUpX, this.clickDistanceToStartCenterTouchUpY,
            this.clickDistanceToTargetCenterTouchDownXY, this.clickDistanceToTargetCenterTouchDownX, this.clickDistanceToTargetCenterTouchDownY,
            this.clickDistanceToTargetCenterTouchUpXY, this.clickDistanceToTargetCenterTouchUpX, this.clickDistanceToTargetCenterTouchUpY,
            this.totalClicksAmount, this.clicksAmountAfterStartClick, this.getTimeToClickFromStartToEndMs(),
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
}

