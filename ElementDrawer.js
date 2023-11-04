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
        this.context.strokeStyle = Config.elementStrokeStyle;
        this.context.fillStyle = Config.startElementFillStyle;
        this.draw();
        if (Config.isDebug) this.displayMiddlePointOfElement(true);
    }

    drawTargetElement() {
        const randomIndex = Math.floor(Math.random() * Config.targetElementFillStyle.length); // determines a random target color
        this.context.fillStyle = Config.targetElementFillStyle[randomIndex];
        this.context.strokeStyle = Config.elementStrokeStyle;
        this.draw();
        if (Config.isDebug) this.displayMiddlePointOfElement(false);
    }

    draw() {
        if (this.shape === "rectangle") {
            // Coordinates of top left corner of the rectangle (center - half of the width of rect)
            const topLeftRectCornerX = this.centerX - this.width / 2;
            const topLeftRectCornerY = this.centerY - this.height / 2;

            this.context.strokeRect(topLeftRectCornerX, topLeftRectCornerY, this.width, this.height);
            this.context.fillRect(topLeftRectCornerX, topLeftRectCornerY, this.width, this.height);
        } else if (this.shape === "circle") {
            this.context.beginPath();
            this.context.arc(this.centerX, this.centerY, this.width / 2, 0, 2 * Math.PI);
            this.context.stroke();
            this.context.fill();
        } else {
            this.alertWronglyRegistered();
        }
    }

    alertWronglyRegistered() {
        alert(`No shape as ${this.shape} is registered!`)
        console.error(`No shape with the name ${this.shape} registered!`);
    }

    displayMiddlePointOfElement(isStartElement) {
        this.context.fillStyle = "rgba(255,0,0,0.8)";
        const elementSize = get1MMInPx();

        if (isStartElement) {
            this.context.fillRect(this.centerX - elementSize / 2, this.centerY - elementSize / 2, elementSize, elementSize);
            this.context.strokeRect(this.centerX - elementSize / 2, this.centerY - elementSize / 2, elementSize, elementSize);
        } else {
            this.context.fillRect(this.centerX - elementSize / 2, this.centerY - elementSize / 2, elementSize, elementSize);
            this.context.strokeRect(this.centerX - elementSize / 2, this.centerY - elementSize / 2, elementSize, elementSize);
        }
    }

}