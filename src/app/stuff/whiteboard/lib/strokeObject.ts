import { CanvasObject, objects, Renderer, Vec2 } from "objective-canvas";

import { whiteboard } from ".";
import { Stroke } from "./types";

export class StrokeObject extends CanvasObject {
    size = Vec2.zero();
    owner = "";

    constructor(public strokeData: Stroke) {
        super(Vec2.from(strokeData.startX, strokeData.startY));
    }

    tick() {
        let posX = this.strokeData.startX;
        let posY = this.strokeData.startY;

        for (const point of this.strokeData.points) {
            posX = Math.min(posX, point.x);
            posY = Math.min(posY, point.y);
        }

        this.pos = Vec2.from(posX, posY);

        let minX = this.strokeData.startX;
        let minY = this.strokeData.startY;
        let maxX = this.strokeData.startX;
        let maxY = this.strokeData.startY;

        for (const point of this.strokeData.points) {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
        }

        this.size = Vec2.from(maxX - minX, maxY - minY);
    }

    draw() {
        const { ctx } = Renderer;

        if (this.strokeData.eraser && !whiteboard.exporting)
            ctx.globalCompositeOperation = "destination-out";
        else
            ctx.globalCompositeOperation = "source-over";

        ctx.strokeStyle = this.strokeData.color;
        if (this.strokeData.eraser && whiteboard.exporting) ctx.strokeStyle = "#0c0c0c";
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
