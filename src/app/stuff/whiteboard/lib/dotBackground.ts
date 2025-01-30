import { Camera } from "objective-canvas";

import { drawCircle } from "@/lib/canvas";

const gridSize = 100;
const backgroundColor = "#0c0c0c";
const dotColor = "#141719";

export default function dotBackground(ctx: CanvasRenderingContext2D) {
    // with camera transformations
    ctx.save();

    ctx.scale(Camera.viewport.scale.x, Camera.viewport.scale.y);
    ctx.translate(-Camera.viewport.left, -Camera.viewport.top);

    const { left, right, top, bottom, width, height } = Camera.viewport;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(left, top, width, height);

    const xStart = (Math.floor(left / gridSize) - 1) * gridSize;
    const xEnd = (Math.ceil(right / gridSize) + 1) * gridSize;
    const yStart = (Math.floor(top / gridSize) - 1) * gridSize;
    const yEnd = (Math.ceil(bottom / gridSize) + 1) * gridSize;

    for (let x = xStart; x <= xEnd; x += gridSize)
        for (let y = yStart; y <= yEnd; y += gridSize)
            drawCircle(x, y, 2, dotColor, ctx);

    ctx.restore();
}
