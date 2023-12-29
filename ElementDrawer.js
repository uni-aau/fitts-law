class ElementDrawer {
    constructor(context, centerX, centerY, width, height, shape) {
        this.context = context;
        this.centerX = centerX;
        this.centerY = centerY;
        this.width = width;
        this.height = height;
        this.shape = shape;
    }

    drawStartElement() {
        this.setElementStyles(Config.startElementFillStyle);
        this.draw();

        if (Config.displayMiddlePointOfElement) this.displayMiddlePointOfElement();
    }

    drawTargetElement() {
        const randomIndex = Math.floor(Math.random() * Config.targetElementFillStyle.length); // determines a random target color
        this.setElementStyles(Config.targetElementFillStyle[randomIndex]);
        this.draw();

        if (Config.displayMiddlePointOfElement) this.displayMiddlePointOfElement();
    }

    draw() {
        if (this.shape === "rectangle") {
            this.drawRectangle();
        } else if (this.shape === "circle") {
            this.drawCircle();
        } else {
            this.alertWronglyRegistered();
        }
    }

    highlight() {
        this.context.fillStyle = Config.targetElementSelectionStyle;
        this.context.beginPath(); // removes previous drawing operations

        if (this.shape === "rectangle") {
            this.drawRectangle();
        } else if (this.shape === "circle") {
            this.drawCircle();
        }
    }

    drawRectangle() {
        // Coordinates of top left corner of the rectangle (center - half of the width of rect)
        const topLeftRectCornerX = this.centerX - this.width / 2;
        const topLeftRectCornerY = this.centerY - this.height / 2;

        this.context.strokeRect(topLeftRectCornerX, topLeftRectCornerY, this.width, this.height);
        this.context.fillRect(topLeftRectCornerX, topLeftRectCornerY, this.width, this.height);
    }

    drawCircle() {
        this.context.beginPath();
        this.context.arc(this.centerX, this.centerY, this.width, 0, 2 * Math.PI);
        this.context.stroke();
        this.context.fill();
    }

    alertWronglyRegistered() {
        alert(`No shape as ${this.shape} is registered!`)
        console.error(`No shape with the name ${this.shape} registered!`);
    }

    displayMiddlePointOfElement() {
        this.context.fillStyle = "rgba(255,0,0,0.8)";
        const elementSize = get1MMInPx();

        this.context.fillRect(this.centerX - elementSize / 2, this.centerY - elementSize / 2, elementSize, elementSize);
        this.context.strokeRect(this.centerX - elementSize / 2, this.centerY - elementSize / 2, elementSize, elementSize);
    }

    setElementStyles(fillStyle) {
        this.context.strokeStyle = Config.elementStrokeStyle;
        this.context.fillStyle = fillStyle;
    }

    // Draws grid for debugging purposes
    static drawGrid(canvasWidth, canvasHeight, context) {
        const padding = 10; // Padding
        const boxSizeX = 10;
        const  boxSizeY = 10;

        for (let i = 0; i <= canvasWidth; i += boxSizeX) {
            context.moveTo(0.5 + i + padding, padding);
            context.lineTo(0.5 + i + padding, canvasHeight + padding);
        }

        for (let i = 0; i <= canvasHeight; i += boxSizeY) {
            context.moveTo(padding, 0.5 + i + padding);
            context.lineTo(canvasWidth + padding, 0.5 + i + padding);
        }
        context.strokeStyle = "black";
        context.stroke();
    }

}