import { CanvasObject, objects, Renderer, Vec2 } from "objective-canvas";

import { combinedSize } from ".";
import { ShapeObject } from "./shapeObject";
import { StrokeObject } from "./strokeObject";

export class DebugObject extends CanvasObject {
    constructor() {
        super(Vec2.zero());
    }

    draw() {
        const { ctx } = Renderer;

        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 1;

        const fullSize = combinedSize(true) as { minX: number, minY: number, maxX: number, maxY: number };

        const min = Vec2.from(fullSize.minX, fullSize.minY);
        const max = Vec2.from(fullSize.maxX, fullSize.maxY);

        ctx.strokeRect(min.x, min.y, max.x - min.x, max.y - min.y);

        for (const object of objects) {
            if (object instanceof StrokeObject) {
                ctx.strokeStyle = "#00ff00";
                ctx.lineWidth = 1;

                ctx.strokeRect(object.pos.x, object.pos.y, object.size.x, object.size.y);
            }

            if (object instanceof ShapeObject) {
                ctx.strokeStyle = "#0000ff";
                ctx.lineWidth = 1;

                ctx.strokeRect(object.pos.x, object.pos.y, object.size.x, object.size.y);
            }
        }
    }
}
