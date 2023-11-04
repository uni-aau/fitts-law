class ElementDrawer {
    constructor(context, centerX, centerY, width, height, shape) {
        this.context = context;
        this.centerX = centerX;
        this.centerY = centerY;
        this.width = width;
        this.height = height;
        this.shape = shape;
    }

    draw() {
        this.context.strokeStyle = Config.elementStrokeStyle;
        this.context.fillStyle = Config.startElementFillStyle;

        const topLeftStartRectCornerX = this.centerX - this.width / 2;
        const topLeftStartRectCornerY = this.centerY - this.height / 2;

        if(this.shape === "rectangle") {
            this.context.strokeRect(topLeftStartRectCornerX, topLeftStartRectCornerY, this.width, this.height);
            this.context.fillRect(topLeftStartRectCornerX, topLeftStartRectCornerY, this.width, this.height);
        } else if(this.shape === "circle") {
            this.context.beginPath();
            this.context.arc(this.centerX, this.centerY, this.width / 2, 0, 2 * Math.PI);
            this.context.stroke();
            this.context.fill();
        } else {
            //TODO
        }
    }

}