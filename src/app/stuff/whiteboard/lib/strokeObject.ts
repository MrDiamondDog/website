import { CanvasObject, objects, Renderer, Vec2 } from "objective-canvas";

import { Stroke } from "./types";

export class StrokeObject extends CanvasObject {
    constructor(public strokeData: Stroke) {
        super(Vec2.from(strokeData.startX, strokeData.startY));
    }

    draw() {
        const { ctx } = Renderer;

        if (this.strokeData.eraser)
            ctx.globalCompositeOperation = "destination-out";
        else
            ctx.globalCompositeOperation = "source-over";

        ctx.strokeStyle = this.strokeData.color;
        ctx.lineWidth = this.strokeData.size;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        ctx.moveTo(this.strokeData.startX, this.strokeData.startY);

        for (const point of this.strokeData.points) {
            ctx.lineTo(point.x, point.y);
        }

        ctx.stroke();
    }

    remove() {
        objects.splice(objects.indexOf(this), 1);
    }
}
