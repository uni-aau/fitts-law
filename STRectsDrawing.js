class STRectsDrawing {
    constructor(trial, trialNumber, rectSize, numRects, onTargetClicked) {
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
    }

    initializeVariables(canvas) {
        this.canvasCenterX = canvas.width / 2;
        this.canvasCenterY = canvas.height / 2;
        this.amplitudePx = mm2px(this.amplitude);
        this.angle = (2 * Math.PI) / this.numRects; // todo numRects wird gar nicht verwendet?

        // Coordinates of the start center point
        this.startX = this.canvasCenterX + this.amplitudePx * Math.cos(this.startIndex * this.angle);
        this.startY = this.canvasCenterY + this.amplitudePx * Math.sin(this.startIndex * this.angle);
        this.startSizePx = mm2px(this.startSize);

        // Coordinates of the target center point
        this.targetX = this.canvasCenterX + this.amplitudePx * Math.cos(this.targetIndex * this.angle);
        this.targetY = this.canvasCenterY + this.amplitudePx * Math.sin(this.targetIndex * this.angle);
    }

    showRects() {
        // let startSizePx, startX, startY;

        // Defines canvas
        let canvasOld = document.getElementById("trialCanvas");
        const canvas = this.removeAllEventListeners(canvasOld) // otherwise multiple clicks will be registered
        const context = canvas.getContext("2d");
        this.initializeVariables(canvas)

        // Calculates width/height of window and clears rect
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        context.clearRect(0, 0, canvas.width, canvas.height);

        canvas.addEventListener("click", this.handleCanvasClick);

        // Start element creation
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
        this.targetWidthPx = mm2px(this.targetWidth);
        this.targetHeightPx = mm2px(this.targetHeight);
        const targetRectX = this.targetX - this.targetWidthPx / 2;
        const targetRectY = this.targetY - this.targetHeightPx / 2;

        if (this.shape === "rectangle") {
            context.strokeRect(
                targetRectX,
                targetRectY,
                this.targetWidthPx,
                this.targetHeightPx
            );
            context.fillRect(
                targetRectX,
                targetRectY,
                this.targetWidthPx,
                this.targetHeightPx
            );
        } else if (this.shape === "circle") {
            const targetSize = mm2px(this.targetWidth);
            context.beginPath();
            context.arc(this.targetX, this.targetY, targetSize / 2, 0, 2 * Math.PI);
            context.stroke();
            context.fill();
        } else {
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
        console.log("Click")
        const canvas = document.getElementById("trialCanvas");
        const context = canvas.getContext("2d");

        // Handle click position
        const rect = canvas.getBoundingClientRect();
        const pressedX = event.clientX - rect.left;
        const pressedY = event.clientY - rect.top;
        console.log("PressX = " + pressedX + " PressY = " + pressedY);

        // Handle canvas variables (todo eigene methode?)
        const canvasCenterX = canvas.width / 2;
        const canvasCenterY = canvas.height / 2;
        const amplitudePx = mm2px(this.amplitude);
        const angle = (2 * Math.PI) / this.numRects;

        // Coordinates of the start & target center point
        const startX = canvasCenterX + amplitudePx * Math.cos(this.startIndex * angle);
        const startY = canvasCenterY + amplitudePx * Math.sin(this.startIndex * angle);
        const targetX = canvasCenterX + amplitudePx * Math.cos(this.targetIndex * angle);
        const targetY = canvasCenterY + amplitudePx * Math.sin(this.targetIndex * angle);
        console.log("StartX = " + startX + " startY = " + startY + " targetX = " + targetX + " targetY = " + targetY)

        const startPx = mm2px(this.startSize);
        const targetWidthPx = mm2px(this.targetWidth); // Width of the target rectangle
        const targetHeightPx = mm2px(this.targetHeight); // Height of the target rectangle

        const distanceToTargetCenter = Math.sqrt((pressedX - targetX) ** 2 + (pressedY - targetY) ** 2);
        const distanceToStartCenter = Math.sqrt((pressedX - startX) ** 2 + (pressedY - startY) ** 2);
        console.log("distanceToTarget = " + distanceToTargetCenter + " distanceStart = " + distanceToStartCenter);

        console.log(distanceToStartCenter < startPx / 2)

        // TODO check ob check ausreicht
        if (!this.startClicked && distanceToStartCenter < startPx / 2) {
            // Clicked on the start
            context.fillStyle = Config.targetElementSelectionStyle;

            context.beginPath(); // removes previous drawing operations
            if (this.shape === "rectangle") {
                context.fillRect(targetX - targetWidthPx / 2, targetY - targetHeightPx / 2, targetWidthPx, targetHeightPx);
            } else if (this.shape === "circle") {
                const startSizePx = mm2px(this.startSize) / 2;
                context.arc(startX, startY, startSizePx, 0, 2 * Math.PI);
                context.fill();
            }
            this.startClicked = true;
        } else {
            // Clicked outside the start

            // Coordinates of the target center point
            const targetX = canvasCenterX + amplitudePx * Math.cos(this.targetIndex * angle);
            const targetY = canvasCenterY + amplitudePx * Math.sin(this.targetIndex * angle);
            
            // Target Size of rect or circle
            const targetSize = this.shape === "rectangle"
                ? Math.max(mm2px(this.targetWidth), mm2px(this.targetHeight))
                : mm2px(this.targetWidth) / 2;
            const distanceToTargetCenter = Math.sqrt((pressedX - targetX) ** 2 + (pressedY - targetY) ** 2);

            // TODO rework click check
            if (this.startClicked && !this.isTargetClicked && distanceToTargetCenter < targetSize) {
                this.onTargetClicked();
                this.handleTargetClick();
                this.isTargetClicked = true;
            }
        }
    }

    handleTargetClick() {
        console.log("Successfully called on target clicked");
        // Use to save data or print to console
    }

    printToConsole() {
        console.log(
            "Information from Drawing: " +
            "Trial Number: " +
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

