import { Vec2 } from "objective-canvas";

import { levels } from "./levels";

export type SquareColor = "red" | "green" | "blue" | "white";
export type SquareType = "start" | "end" | "dot" | "pit" | "void";

export type GridSquare = {
    color?: SquareColor,
    type: SquareType,
    linePoints?: Vec2[],
    pos?: Vec2
} | null;

export type Level = {
    gridSize: Vec2;
    grid: GridSquare[][];
}

let squareSize = 100;
let imageSize = 70;
let squareGap = 7;

export const gridColors = {
    red: "#ff0000",
    green: "#00ff00",
    blue: "#0026FF",
    white: "#ffffff"
};

export const game = {
    canvas: null as HTMLCanvasElement | null,
    ctx: null as CanvasRenderingContext2D | null,

    currentLevel: levels[0],

    mousePos: Vec2.from(0, 0),
    mouseGridPos: Vec2.from(0, 0),
    mouseDown: false,

    startPos: null as Vec2 | null,

    bg: null as HTMLDivElement | null,

    isEditor: false,
    editor: {
        selectedColor: "white" as SquareColor,
        selectedTool: "start" as SquareType | "eraser"
    },

    updateCanvasSize() {
        // both width and height of grid should affect square size
        // max of 100 at around 3x3 grid
        squareSize = Math.min(100, 1500 / (game.currentLevel.gridSize.x + game.currentLevel.gridSize.y));
        imageSize = squareSize * 0.7;
        squareGap = squareSize * 0.07;

        game.canvas!.width = game.currentLevel.gridSize.x * squareSize + (game.currentLevel.gridSize.x - 1) * squareGap;
        game.canvas!.height = game.currentLevel.gridSize.y * squareSize + (game.currentLevel.gridSize.y - 1) * squareGap;
    },

    setLevel(level: Level) {
        game.currentLevel = level;
        game.updateCanvasSize();

        game.bg.style.backgroundColor = "#000";
    }
};
const images: Record<string, HTMLImageElement | Record<string, HTMLImageElement>> = {};

export async function initGame(canvas: HTMLCanvasElement, bg: HTMLDivElement, isEditor?: boolean) {
    game.canvas = canvas;
    game.bg = bg;
    game.isEditor = isEditor ?? false;
    game.ctx = canvas.getContext("2d")!;

    const imagePaths = {
        start: "/images/1-s/{color}/box-start.png",
        end: "/images/1-s/{color}/box-end.png",
        dot: "/images/1-s/{color}/dot.png",
        pit: "/images/1-s/{color}/pit.png",
        background: "/images/1-s/background.png"
    };

    const imageSrcs = {
        background: imagePaths.background,
        start: {
            red: imagePaths.start.replace("{color}", "red"),
            green: imagePaths.start.replace("{color}", "green"),
            blue: imagePaths.start.replace("{color}", "blue"),
            white: imagePaths.start.replace("{color}", "white"),
        },
        end: {
            red: imagePaths.end.replace("{color}", "red"),
            green: imagePaths.end.replace("{color}", "green"),
            blue: imagePaths.end.replace("{color}", "blue"),
            white: imagePaths.end.replace("{color}", "white"),
        },
        dot: {
            red: imagePaths.dot.replace("{color}", "red"),
            green: imagePaths.dot.replace("{color}", "green"),
            blue: imagePaths.dot.replace("{color}", "blue"),
            white: imagePaths.dot.replace("{color}", "white"),
        },
        pit: {
            red: imagePaths.pit.replace("{color}", "red"),
            green: imagePaths.pit.replace("{color}", "green"),
            blue: imagePaths.pit.replace("{color}", "blue"),
            white: imagePaths.pit.replace("{color}", "white"),
        }
    };

    await new Promise(resolve => {
        for (const type in imageSrcs) {
            const src = imageSrcs[type];
            if (typeof src === "string") {
                images[type] = new Image();
                images[type].src = src;
            } else {
                for (const color in src) {
                    if (!images[type]) images[type] = {};

                    images[type][color] = new Image();
                    images[type][color].src = src[color];

                    images[type][color].onload = resolve;
                }
            }
        }
    });

    game.updateCanvasSize();

    game.canvas.addEventListener("mousemove", e => {
        game.mousePos = Vec2.from(e.offsetX, e.offsetY);
        game.mouseGridPos = Vec2.from(
            Math.floor(game.mousePos.x / (squareSize + squareGap)),
            Math.floor(game.mousePos.y / (squareSize + squareGap))
        );

        if (game.mouseDown) {
            if (!game.startPos) return;

            // if mouse is outside grid
            if (game.mouseGridPos.x >= game.currentLevel.gridSize.x || game.mouseGridPos.y >= game.currentLevel.gridSize.y) return;

            const startSquare = game.currentLevel.grid[game.startPos.x][game.startPos.y];
            const lastSquare = startSquare.linePoints[startSquare.linePoints.length - 1];
            const prevSquare = startSquare.linePoints[startSquare.linePoints.length - 2];
            const currentSquare = game.currentLevel.grid[game.mouseGridPos.x][game.mouseGridPos.y];

            // remove last point if mouse goes back a point
            if (prevSquare?.x === game.mouseGridPos.x && prevSquare?.y === game.mouseGridPos.y) {
                startSquare.linePoints.pop();
                return;
            }

            // if only one point exists and mouse is on start square
            if (startSquare.linePoints.length === 1 && game.startPos.x === game.mouseGridPos.x && game.startPos.y === game.mouseGridPos.y) {
                startSquare.linePoints = [];
                return;
            }

            // if mouse is on start square
            if (game.startPos.x === game.mouseGridPos.x && game.startPos.y === game.mouseGridPos.y) return;
            // if mouse is on a point that already exists
            if (startSquare.linePoints.find(point => point.x === game.mouseGridPos.x && point.y === game.mouseGridPos.y)) return;

            // if mouse is in void
            if (currentSquare?.type === "void") return;

            // if mouse is on a different line
            const allStartSquares = game.currentLevel.grid.flat().filter(square => square?.type === "start");
            for (const startSquare of allStartSquares) {
                if (startSquare.linePoints?.find(point => point.x === game.mouseGridPos.x && point.y === game.mouseGridPos.y)) return;
            }

            // if mouse is not adjacent to last point
            if (!isAdjacent(lastSquare ?? game.startPos, game.mouseGridPos))
                return;

            startSquare.linePoints.push(game.mouseGridPos);
        }
    });

    game.canvas.addEventListener("mousedown", () => {
        game.mouseDown = true;

        if (game.isEditor && game.mouseDown) {
            const square = game.currentLevel.grid[game.mouseGridPos.x]?.[game.mouseGridPos.y];

            if (square === undefined) return;

            if (game.editor.selectedTool === "eraser")
                return void (game.currentLevel.grid[game.mouseGridPos.x][game.mouseGridPos.y] = null);

            game.currentLevel.grid[game.mouseGridPos.x][game.mouseGridPos.y] = {
                type: game.editor.selectedTool,
                color: game.editor.selectedColor
            };
        }

        if (game.isEditor) return;

        for (let x = 0; x < game.currentLevel.gridSize.x; x++) {
            for (let y = 0; y < game.currentLevel.gridSize.y; y++) {
                const square = game.currentLevel.grid[x][y];
                if (square) square.pos = Vec2.from(x, y);
            }
        }

        const square = game.currentLevel.grid[game.mouseGridPos.x]?.[game.mouseGridPos.y];
        if (square?.type === "start") {
            game.startPos = game.mouseGridPos;
            square.linePoints = [];
        }
    });

    window.addEventListener("mouseup", () => {
        game.mouseDown = false;

        if (game.isEditor) return;

        if (game.startPos) {
            const startSquare = game.currentLevel.grid[game.startPos.x]?.[game.startPos.y];
            const endSquare = startSquare.linePoints[startSquare.linePoints.length - 1];
            if (endSquare && game.currentLevel.grid[endSquare.x][endSquare.y]?.type !== "end") {
                startSquare.linePoints = [];
            }
        }

        game.startPos = null;

        const validity = validate();
        console.log(validity);
        if (validity === "invalid") {
            const startSquares = game.currentLevel.grid.flat().filter(square => square?.type === "start");
            for (const startSquare of startSquares) {
                startSquare.linePoints = [];
            }

            bg.style.backgroundColor = "#ff0000";
            // slow fade back to transparent background
            let i = 0;
            const timeout = setInterval(() => {
                if (i >= 100) {
                    clearInterval(timeout);
                    bg.style.backgroundColor = "#000";
                }

                bg.style.backgroundColor = interpolateColor("#ff0000", "#000", i);
                i++;
            });
        } else if (validity === "valid") {
            bg.style.backgroundColor = "#00ff00";
        } else if (validity === "incomplete") {
            if (bg.style.backgroundColor !== "rgb(0, 255, 0)") return;
            let i = 0;
            const timeout = setInterval(() => {
                if (i >= 100) {
                    clearInterval(timeout);
                    bg.style.backgroundColor = "#000";
                }

                bg.style.backgroundColor = interpolateColor("#00ff00", "#000", i);
                i++;
            });
        }
    });

    game.ctx.imageSmoothingEnabled = false;
    draw();
}

function draw() {
    if (!game.ctx) return;

    game.ctx.clearRect(0, 0, game.canvas!.width, game.canvas!.height);
    game.ctx.imageSmoothingEnabled = false;

    const { gridSize, grid } = game.currentLevel;

    if (grid.length !== gridSize.x || grid[0].length !== gridSize.y) {
        // add extra rows/cols if there are more rows/cols than grid size, and vice versa
        while (grid.length < gridSize.x) {
            grid.push(new Array(gridSize.y).fill(null));
        }

        for (let x = 0; x < gridSize.x; x++) {
            while (grid[x].length < gridSize.y) {
                grid[x].push(null);
            }
        }

        game.updateCanvasSize();
        game.ctx.imageSmoothingEnabled = false;
    }

    for (let x = 0; x < gridSize.x; x++) {
        for (let y = 0; y < gridSize.y; y++) {
            const square = grid[x][y];

            if (!square || square?.type === "void") continue;

            const img = images[square.type][square.color];
            drawSquare(x, y, img, square.type);
        }
    }

    drawAll();

    requestAnimationFrame(draw);
}

const drawQueue: { x: number, y: number, img: HTMLImageElement, type: SquareType }[] = [];

function drawSquare(x: number, y: number, img: HTMLImageElement, type: SquareType) {
    drawQueue.push({ x: x * squareSize + (squareSize - imageSize) / 2 + squareGap * x, y: y * squareSize + (squareSize - imageSize) / 2 + squareGap * y, img, type });
}

function drawAll() {
    const { gridSize, grid } = game.currentLevel;

    for (let x = 0; x < gridSize.x; x++) {
        for (let y = 0; y < gridSize.y; y++) {
            if (grid[x][y]?.type === "void") continue;
            game.ctx.drawImage(images.background as HTMLImageElement, x * squareSize + squareGap * x, y * squareSize + squareGap * y, squareSize, squareSize);
        }
    }

    for (const square of drawQueue) {
        if (square.type === "dot" || square.type === "pit") {
            game.ctx?.drawImage(square.img, square.x, square.y, imageSize, imageSize);
        }
    }

    for (const square of drawQueue) {
        if (square.type !== "dot" && square.type !== "pit") {
            game.ctx?.drawImage(square.img, square.x, square.y, imageSize, imageSize);
        }
    }

    const startSquares = grid.flat().filter(square => square?.type === "start");

    for (const square of startSquares) {
        if (!square.linePoints?.length) continue;

        const { x, y } = (square.pos!);

        game.ctx.lineCap = "round";
        game.ctx.lineJoin = "round";

        game.ctx.strokeStyle = gridColors[square.color];
        game.ctx.lineWidth = imageSize / 2;

        let prev: Vec2;
        for (const point of square.linePoints) {
            let start = prev ?? Vec2.from(x, y);

            start = start.scale(squareSize).add(squareSize / 2);
            start.x += squareGap * (prev ? prev.x : x);
            start.y += squareGap * (prev ? prev.y : y);

            const end = point.scale(squareSize).add(squareSize / 2);
            end.x += squareGap * point.x;
            end.y += squareGap * point.y;

            line(start, end);

            prev = point;
        }

        const endPoint = square.linePoints[square.linePoints.length - 1];
        const endSquare = endPoint ? grid[endPoint.x][endPoint.y] : null;
        if (endSquare?.type === "end")
            game.ctx.drawImage(images.start[endSquare.color], endPoint.x * squareSize + (squareSize - imageSize) / 2 + squareGap * endPoint.x, endPoint.y * squareSize + (squareSize - imageSize) / 2 + squareGap * endPoint.y, imageSize, imageSize);
    }

    drawQueue.length = 0;
}

function validate(): "invalid" | "valid" | "incomplete" {
    let verdict: "invalid" | "valid" | "incomplete" = "valid";

    const startSquares = game.currentLevel.grid.flat().filter(square => square?.type === "start");
    const dots = game.currentLevel.grid.flat().filter(square => square?.type === "dot").map(square => square!.pos!);
    const capturedDots: { pos: Vec2, color: string }[] = [];

    for (const startSquare of startSquares) {
        if (!startSquare.linePoints?.length) {
            verdict = "incomplete";
            continue;
        }

        // if line doesn't end on end square
        const lineEndPos = startSquare.linePoints[startSquare.linePoints.length - 1];
        if (!lineEndPos) {
            verdict = "invalid";
            break;
        }
        const lineEndSquare = game.currentLevel.grid[lineEndPos.x][lineEndPos.y];
        if (lineEndSquare?.type !== "end") {
            verdict = "invalid";
            break;
        }

        // if line goes over pit of same color (or white)
        if (startSquare.linePoints.find(point => {
            const square = game.currentLevel.grid[point.x][point.y];
            return square?.type === "pit" && (square?.color === startSquare.color || square?.color === "white");
        })) {
            verdict = "invalid";
            break;
        }

        // if line goes over different color end square
        if (lineEndSquare?.color !== startSquare.color && lineEndSquare?.color !== "white") {
            verdict = "invalid";
            break;
        }

        // if line goes over more than one end square
        if (startSquare.linePoints.filter(point => {
            const square = game.currentLevel.grid[point.x][point.y];
            return square?.type === "end";
        }).length > 1) {
            verdict = "invalid";
            break;
        }

        for (const point of startSquare.linePoints) {
            const dotPos = dots.find(dot => dot.x === point.x && dot.y === point.y);
            if (!dotPos) continue;
            const dot = game.currentLevel.grid[dotPos.x][dotPos.y];

            if (dot.color !== startSquare.color && dot.color !== "white") {
                verdict = "invalid";
                break;
            }

            capturedDots.push({ pos: point, color: dot.color });
        }
        if (verdict !== "valid") break;
    }

    if (verdict === "valid") {
        const capturedWhiteDots = capturedDots.filter(dot => dot.color === "white");
        const totalWhiteDots = dots.filter(dot => game.currentLevel.grid[dot.x][dot.y].color === "white");

        if (capturedWhiteDots.length !== totalWhiteDots.length) {
            verdict = "incomplete";
        }

        for (const color of ["red", "green", "blue"]) {
            const capturedColorDots = capturedDots.filter(dot => dot.color === color);
            const totalColorDots = dots.filter(dot => game.currentLevel.grid[dot.x][dot.y].color === color);

            if (capturedColorDots.length !== totalColorDots.length) {
                verdict = "incomplete";
            }
        }
    }

    // if there are no squares that have no line points
    if (!startSquares.filter(square => !square.linePoints?.length).length) {
        if (verdict === "incomplete") {
            verdict = "invalid";
        }
    }

    return verdict;
}

function line(from: Vec2, to: Vec2) {
    game.ctx?.beginPath();
    game.ctx?.moveTo(from.x, from.y);
    game.ctx?.lineTo(to.x, to.y);
    game.ctx?.stroke();
}

function isAdjacent(a: Vec2, b: Vec2) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
}

function interpolateColor(hex1: string, hex2: string, t: number) {
    // Ensure that t is in the range [0, 100]
    t = Math.max(0, Math.min(100, t)) / 100;

    // Convert hex color to RGB values
    const hexToRgb = (hex: string) => {
        const bigint = parseInt(hex.slice(1), 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    };

    // Convert RGB values back to hex
    const rgbToHex = (r: number, g: number, b: number) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    };

    // Get the RGB values of both hex colors
    const color1 = hexToRgb(hex1);
    const color2 = hexToRgb(hex2);

    // Interpolate between the two colors
    const r = Math.round(color1.r + (color2.r - color1.r) * t);
    const g = Math.round(color1.g + (color2.g - color1.g) * t);
    const b = Math.round(color1.b + (color2.b - color1.b) * t);

    // Return the resulting hex color
    return rgbToHex(r, g, b);
}
