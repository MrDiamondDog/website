import { CanvasObject, Renderer, Vec2 } from "objective-canvas";

import { ShapeStroke } from "./types";

export class ShapeObject extends CanvasObject {
    constructor(public strokeData: ShapeStroke) {
        super(Vec2.from(strokeData.startX, strokeData.startY));
    }

    draw() {
        const { ctx } = Renderer;

        ctx.strokeStyle = this.strokeData.color;
        ctx.lineWidth = this.strokeData.size;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalCompositeOperation = "source-over";

        if (this.strokeData.fill)
            ctx.fillStyle = this.strokeData.color;

        ctx.beginPath();

        switch (this.strokeData.shape) {
            case "line":
                ctx.moveTo(this.strokeData.startX, this.strokeData.startY);
                ctx.lineTo(this.strokeData.endX, this.strokeData.endY);
                break;

            case "rectangle":
                ctx.rect(this.strokeData.startX, this.strokeData.startY, this.strokeData.endX - this.strokeData.startX, this.strokeData.endY - this.strokeData.startY);
                break;

            case "circle":
                // ellipse
                const radiusX = Math.abs(this.strokeData.endX - this.strokeData.startX) / 2;
                const radiusY = Math.abs(this.strokeData.endY - this.strokeData.startY) / 2;
                const centerX = this.strokeData.startX + radiusX;
                const centerY = this.strokeData.startY + radiusY;

                ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
                break;
        }

        if (this.strokeData.fill)
            ctx.fill();
        else
            ctx.stroke();
    }
}
