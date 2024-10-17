import { line, Vec2 } from "objective-canvas";

import { levels } from "./levels";

export type GridSquare = {
    color: "red" | "green" | "blue" | "white",
    type: "start" | "end" | "dot" | "pit",
    linePoints?: Vec2[]
} | null;

export type Level = {
    gridSize: Vec2;
    grid: GridSquare[][];
}

const squareSize = 100;

const game = {
    canvas: null as HTMLCanvasElement | null,
    ctx: null as CanvasRenderingContext2D | null,

    currentLevel: levels[0],

    mousePos: Vec2.from(0, 0),
    mouseGridPos: Vec2.from(0, 0),
    mouseDown: false,

    startPos: null as Vec2 | null
};
const images: Record<string, HTMLImageElement> = {};

export async function initGame(canvas: HTMLCanvasElement) {
    game.canvas = canvas;
    game.ctx = canvas.getContext("2d")!;


    const imageSrcs = {
        start: "/images/1-s/box-start.webp",
        end: "/images/1-s/box-end.webp",
        dot: "/images/1-s/dot.webp",
        pit: "/images/1-s/pit.webp",
    };


    for (const [key, src] of Object.entries(imageSrcs)) {
        const img = new Image();
        img.src = src;
        images[key] = img;
    }

    await Promise.all(Object.values(images).map(img => new Promise(resolve => img.onload = resolve)));

    game.canvas.width = window.innerWidth;
    game.canvas.height = window.innerHeight;

    game.canvas.addEventListener("mousemove", e => {
        game.mousePos = Vec2.from(e.clientX, e.clientY);
        game.mouseGridPos = Vec2.from(
            Math.floor(game.mousePos.x / squareSize),
            Math.floor(game.mousePos.y / squareSize)
        );

        if (game.mouseDown) {
            if (!game.startPos) return;

            const startSquare = game.currentLevel.grid[game.startPos.x][game.startPos.y];

            if (!startSquare.linePoints) startSquare.linePoints = [];
            if (startSquare.linePoints.find(point => point.x === game.mouseGridPos.x && point.y === game.mouseGridPos.y)) return;

            console.log(startSquare.linePoints);
            startSquare.linePoints.push(game.mouseGridPos);
        }
    });

    game.canvas.addEventListener("mousedown", () => {
        game.mouseDown = true;

        if (game.currentLevel.grid[game.mouseGridPos.x][game.mouseGridPos.y].type === "start")
            game.startPos = game.mouseGridPos;
    });

    game.canvas.addEventListener("mouseup", () => {
        game.mouseDown = false;

        game.startPos = null;
    });

    draw();
}

function draw() {
    if (!game.ctx) return;

    game.ctx.clearRect(0, 0, game.canvas!.width, game.canvas!.height);

    const { gridSize, grid } = game.currentLevel;

    if (grid.length !== gridSize.x || grid[0].length !== gridSize.y) {
        throw new Error("Invalid grid size");
    }

    for (let x = 0; x < gridSize.x; x++) {
        for (let y = 0; y < gridSize.y; y++) {
            const square = grid[x][y];
            if (!square) continue;

            const img = images[square.type];
            game.ctx.fillStyle = square.color;
            game.ctx.imageSmoothingEnabled = false;
            game.ctx.drawImage(img, x * squareSize, y * squareSize, squareSize, squareSize);

            if (square.type === "start" && square.linePoints?.length) {
                game.ctx.strokeStyle = square.color;
                game.ctx.lineWidth = 5;

                let prev: Vec2;
                for (const point of square.linePoints) {
                    const start = prev ?? Vec2.from(x * squareSize, y * squareSize);
                    line(start, point);
                    prev = point;
                }
            }
        }
    }
}
