import { CanvasObject, Renderer, Vec2 } from "objective-canvas";

import { whiteboard } from ".";

export class MultiplayerObject extends CanvasObject {
    constructor() {
        super(Vec2.zero());
    }

    draw(): void {
        if (!whiteboard.ws) return;
        const { ctx } = Renderer;

        for (const user of whiteboard.users) {
            if (user.id === whiteboard.user.id) continue;

            ctx.fillStyle = user.color;
            ctx.strokeStyle = user.color;
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.arc(user.mousePos.x, user.mousePos.y, 5, 0, 2 * Math.PI);
            ctx.stroke();

            ctx.font = "20px Arial";
            ctx.fillText(user.name, user.mousePos.x + 10, user.mousePos.y - 10);
        }
    }
}
