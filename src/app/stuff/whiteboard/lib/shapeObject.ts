import { CanvasObject, Renderer, Vec2 } from "objective-canvas";

import { ShapeStroke } from "./types";

export class ShapeObject extends CanvasObject {
    size = Vec2.zero();
    owner = "";

    constructor(public strokeData: ShapeStroke) {
        super(Vec2.from(strokeData.startX, strokeData.startY));
    }

    tick() {
        this.pos = Vec2.from(
            Math.min(this.strokeData.startX, this.strokeData.endX),
            Math.min(this.strokeData.startY, this.strokeData.endY)
        );

        this.size = Vec2.from(
            Math.abs(this.strokeData.endX - this.strokeData.startX),
            Math.abs(this.strokeData.endY - this.strokeData.startY)
        );
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

            ctx.stroke();
            return;

        case "arrow":
            const angle = Math.atan2(
                this.strokeData.endY - this.strokeData.startY,
                this.strokeData.endX - this.strokeData.startX
            );
            const headLength = 10 + this.strokeData.size;

            ctx.moveTo(this.strokeData.startX, this.strokeData.startY);
            ctx.lineTo(this.strokeData.endX, this.strokeData.endY);

            ctx.moveTo(
                this.strokeData.endX - headLength * Math.cos(angle - Math.PI / 6),
                this.strokeData.endY - headLength * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(this.strokeData.endX, this.strokeData.endY);
            ctx.lineTo(
                this.strokeData.endX - headLength * Math.cos(angle + Math.PI / 6),
                this.strokeData.endY - headLength * Math.sin(angle + Math.PI / 6)
            );

            ctx.stroke();
            return;

        case "rectangle":
            ctx.rect(
                this.strokeData.startX,
                this.strokeData.startY,
                this.strokeData.endX - this.strokeData.startX,
                this.strokeData.endY - this.strokeData.startY
            );
            break;

        case "circle":
            // ellipse
            const x = (this.strokeData.startX + this.strokeData.endX) / 2;
            const y = (this.strokeData.startY + this.strokeData.endY) / 2;
            const w = Math.abs(this.strokeData.endX - this.strokeData.startX);
            const h = Math.abs(this.strokeData.endY - this.strokeData.startY);

            ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2);
            break;
        }

        if (this.strokeData.fill)
            ctx.fill();
        else
            ctx.stroke();
    }
}
