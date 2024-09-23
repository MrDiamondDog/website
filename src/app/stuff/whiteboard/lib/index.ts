import { APIUser } from "discord-api-types/v10";
import { Camera, Debugging, Mouse, objects, Renderer, Vec2 } from "objective-canvas";

import { DebugObject } from "./debugObject";
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

    redoStack: [] as { obj: (StrokeObject | ShapeObject), index: number }[],

    exporting: false,

    debug: false,
    profiler: false,

    ws: null as WebSocket | null,
    users: [] as { name: string, mousePos: Vec2, color: string, id: string }[],
    user: null as APIUser | null,
    roomCode: ""
};

export function initWhiteboard(canvas: HTMLCanvasElement) {
    whiteboard.canvas = canvas;

    debug("init", "adding listeners");

    canvas.addEventListener("contextmenu", e => e.preventDefault());
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    window.addEventListener("keydown", e => {
        if (whiteboard.ws) return;
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
                eraser: whiteboard.selectedTool === "eraser",
                owner: whiteboard.user.id
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
                fill: whiteboard.shapeFill,
                owner: whiteboard.user.id
            });

            whiteboard.currentStroke.addToScene();
        }
    });

    let lastMove = 0;
    Mouse.events.on("move", () => {
        if (whiteboard.selectedTool === "pen" || whiteboard.selectedTool === "eraser")
            (whiteboard.currentStroke as StrokeObject)?.strokeData.points.push(Mouse.worldPos);

        else if (whiteboard.selectedTool === "shape") {
            if (!whiteboard.currentStroke) return;

            (whiteboard.currentStroke as ShapeObject).strokeData.endX = Mouse.worldPos.x;
            (whiteboard.currentStroke as ShapeObject).strokeData.endY = Mouse.worldPos.y;
        }

        if (whiteboard.ws) {
            // if last move event was less than 50ms ago, don't send another one
            if (Date.now() - lastMove < 50) return;

            whiteboard.ws.send(JSON.stringify({
                type: "mousemove",
                x: Mouse.worldPos.x,
                y: Mouse.worldPos.y,
                roomCode: whiteboard.roomCode,
                id: whiteboard.user.id
            }));
        }

        lastMove = Date.now();
    });

    Mouse.events.on("up", () => {
        if (whiteboard.currentStroke) {
            if (whiteboard.ws)
                whiteboard.ws.send(JSON.stringify({
                    type: "stroke",
                    stroke: whiteboard.currentStroke.strokeData,
                    shape: whiteboard.selectedTool === "shape",
                    roomCode: whiteboard.roomCode,
                    id: whiteboard.user.id
                }));

            whiteboard.currentStroke = null;
        }
    });

    debug("init", "initializing renderer");

    Renderer.init({
        canvas,

        cameraControls: {
            moveButton: () => Mouse.rightDown
        }
    });
}

export function setDebug(debug: boolean) {
    const prevDebug = whiteboard.debug;
    whiteboard.debug = debug;

    Debugging.debugEnabled = debug;

    if (debug && !prevDebug)
        objects.unshift(new DebugObject());
    else if (objects[0] instanceof DebugObject && !debug && prevDebug)
        objects.shift();
}

export function setProfiler(profiler: boolean) {
    whiteboard.profiler = profiler;

    Debugging.profilerEnabled = profiler;
}

export function undo() {
    if (!objects.length) return;

    const toRemove = objects.findLastIndex(object => (object instanceof StrokeObject || object instanceof ShapeObject) && (!whiteboard.ws || object.owner === whiteboard.user.id));

    if (toRemove === -1) return;

    whiteboard.redoStack.push({ obj: objects[toRemove] as StrokeObject | ShapeObject, index: toRemove });

    objects.splice(toRemove, 1);
}

export function redo() {
    if (!whiteboard.redoStack.length) return;

    const object = whiteboard.redoStack.pop();

    objects.splice(object.index, 0, object.obj);
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

    debug("export", "exporting canvas with size of", exportCanvas.width, "x", exportCanvas.height);

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

    whiteboard.exporting = false;

    debug("export", "exported canvas");

    return exportCanvas;
}

export function debug(scope: string, ...args: any[]) {
    console.log(`%c${scope}%c ${args.map(a => a.toString()).join(" ")}`, "padding: 2px 4px; background-color: #0b6ca8", "");
}
