import { Mouse, Renderer } from "objective-canvas";

import { ShapeObject } from "./shapeObject";
import { StrokeObject } from "./strokeObject";
import { Shape, Tool } from "./types";

export const whiteboard = {
    canvas: null as HTMLCanvasElement | null,

    selectedTool: "pen" as Tool,
    selectedShape: "line" as Shape,

    shapeFill: false,

    brushColor: "#ff0000",
    brushSize: 5,

    currentStroke: null as StrokeObject | ShapeObject | null
};

export function initWhiteboard(canvas: HTMLCanvasElement) {
    whiteboard.canvas = canvas;

    canvas.addEventListener("contextmenu", e => e.preventDefault());
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    Mouse.events.on("down", () => {
        if (!Mouse.leftDown) return;
        if (whiteboard.currentStroke) return;

        if (whiteboard.selectedTool === "pen" || whiteboard.selectedTool === "eraser") {
            whiteboard.currentStroke = new StrokeObject({
                startX: Mouse.worldPos.x,
                startY: Mouse.worldPos.y,
                points: [],
                color: whiteboard.brushColor,
                size: whiteboard.brushSize,
                eraser: whiteboard.selectedTool === "eraser"
            });

            whiteboard.currentStroke.strokeData.points.push(Mouse.worldPos);

            whiteboard.currentStroke.addToScene();
        } else if (whiteboard.selectedTool === "shape") {
            whiteboard.currentStroke = new ShapeObject({
                shape: whiteboard.selectedShape,
                startX: Mouse.worldPos.x,
                startY: Mouse.worldPos.y,
                endX: Mouse.worldPos.x,
                endY: Mouse.worldPos.y,
                color: whiteboard.brushColor,
                size: whiteboard.brushSize,
                fill: whiteboard.shapeFill
            });

            whiteboard.currentStroke.addToScene();
        }
    });

    Mouse.events.on("move", () => {
        if (whiteboard.selectedTool === "pen" || whiteboard.selectedTool === "eraser")
            (whiteboard.currentStroke as StrokeObject)?.strokeData.points.push(Mouse.worldPos);

        else if (whiteboard.selectedTool === "shape") {
            if (!whiteboard.currentStroke) return;

            (whiteboard.currentStroke as ShapeObject).strokeData.endX = Mouse.worldPos.x;
            (whiteboard.currentStroke as ShapeObject).strokeData.endY = Mouse.worldPos.y;
        }
    });

    Mouse.events.on("up", () => {
        if (whiteboard.currentStroke)
            whiteboard.currentStroke = null;
    });

    Renderer.init({
        canvas,

        cameraControls: {
            moveButton: () => Mouse.rightDown
        }
    });
}
