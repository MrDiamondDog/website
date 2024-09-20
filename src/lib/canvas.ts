import { Renderer } from "objective-canvas";

export function drawCircle(x: number, y: number, radius: number, color: string, ctx = Renderer.ctx) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}
