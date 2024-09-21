import { Camera, Mouse, objects, Renderer, Vec2 } from "objective-canvas";

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

    currentStroke: null as StrokeObject | ShapeObject | null,

    redoStack: [] as (StrokeObject | ShapeObject)[],

    exporting: false
};

export function initWhiteboard(canvas: HTMLCanvasElement) {
    whiteboard.canvas = canvas;

    canvas.addEventListener("contextmenu", e => e.preventDefault());
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    window.addEventListener("keydown", e => {
        if (e.ctrlKey && e.key === "z") {
            undo();
        } else if (e.ctrlKey && e.key === "y") {
            redo();
        }
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

    // objects.push(new DebugObject(Vec2.zero()));
}

export function undo() {
    if (!objects.length) return;
    if (!(objects[objects.length - 1] instanceof ShapeObject) && !(objects[objects.length - 1] instanceof StrokeObject))
        return;

    whiteboard.redoStack.push(objects.pop() as StrokeObject | ShapeObject);
}

export function redo() {
    if (!whiteboard.redoStack.length) return;

    objects.push(whiteboard.redoStack.pop());
}

export const canvasBuffer = 100;

export function combinedSize(bounds?: boolean) {
    // a bounding box that contains all of the strokes and shapes (if bounds = false, return the vector that represents the size instead)
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const object of objects) {
        if (object instanceof StrokeObject) {
            const { size } = object;
            minX = Math.min(minX, object.pos.x);
            minY = Math.min(minY, object.pos.y);
            maxX = Math.max(maxX, object.pos.x + size.x);
            maxY = Math.max(maxY, object.pos.y + size.y);
        } else if (object instanceof ShapeObject) {
            const { size } = object;
            minX = Math.min(minX, object.pos.x);
            minY = Math.min(minY, object.pos.y);
            maxX = Math.max(maxX, object.pos.x + size.x);
            maxY = Math.max(maxY, object.pos.y + size.y);
        }
    }

    if (bounds) return { minX, minY, maxX, maxY };
    return Vec2.from(Math.round(maxX - minX) + canvasBuffer, Math.round(maxY - minY) + canvasBuffer);
}

export function exportCanvas(transparent?: boolean) {
    const exportCanvas = document.createElement("canvas");

    whiteboard.exporting = !transparent ?? true;

    const size = combinedSize(true) as { minX: number, minY: number, maxX: number, maxY: number };
    exportCanvas.width = Math.round(size.maxX - size.minX) + canvasBuffer;
    exportCanvas.height = Math.round(size.maxY - size.minY) + canvasBuffer;

    const ctx = exportCanvas.getContext("2d")!;
    ctx.fillStyle = transparent ? "transparent" : "#0c0c0c";
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    const oldCtx = Renderer.ctx;
    const oldCanvas = Renderer.canvas;

    Renderer.ctx = ctx;
    Renderer.canvas = exportCanvas;

    Camera.lookAt = Vec2.from(exportCanvas.width / 2, exportCanvas.height / 2);

    Camera.viewport.left = size.minX - canvasBuffer / 2;
    Camera.viewport.right = size.maxX + canvasBuffer / 2;
    Camera.viewport.top = size.minY - canvasBuffer / 2;
    Camera.viewport.bottom = size.maxY + canvasBuffer / 2;

    Camera.viewport.width = Camera.viewport.right - Camera.viewport.left;
    Camera.viewport.height = Camera.viewport.bottom - Camera.viewport.top;

    Camera.viewport.scale.x = exportCanvas.width / Camera.viewport.width;
    Camera.viewport.scale.y = exportCanvas.height / Camera.viewport.height;

    Camera.begin();

    for (const object of objects) {
        if (object instanceof StrokeObject)
            object.draw();
        else if (object instanceof ShapeObject)
            object.draw();
    }

    Camera.end();

    Renderer.ctx = oldCtx;
    Renderer.canvas = oldCanvas;

    return exportCanvas;
}
