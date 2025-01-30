"use client";

import { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa6";

import { colors } from "@/lib/util";

export default function GameOfLifeBackground() {
    const canvas = useRef<HTMLCanvasElement>(null);

    const [playing, setPlaying] = useState(false);

    let grid: boolean[][] = [];
    const gridSquareSize = 16;
    const started = useRef(false);

    let mousedown = false;
    let mouseToggle = false;
    let frame = 0;
    const isPlaying = useRef(false);

    useEffect(() => {
        if (!canvas.current)
            return;
        if (started.current)
            return;
        started.current = true;

        window.addEventListener("resize", () => {
            if (!canvas.current)
                return;
            canvas.current.width = window.innerWidth;
            canvas.current.height = window.innerHeight;
        });

        window.addEventListener("mousedown", e => {
            mousedown = true;

            const mousePos = { x: e.clientX, y: e.clientY };

            const x = Math.floor(mousePos.x / gridSquareSize);
            const y = Math.floor(mousePos.y / gridSquareSize);

            mouseToggle = !grid[x][y];
            grid[x][y] = !grid[x][y];
        });
        window.addEventListener("mouseup", e => {
            mousedown = false;
        });

        window.addEventListener("mousemove", e => {
            if (!mousedown)
                return;

            const mousePos = { x: e.clientX, y: e.clientY };

            const x = Math.floor(mousePos.x / gridSquareSize);
            const y = Math.floor(mousePos.y / gridSquareSize);

            grid[x][y] = mouseToggle;
        });

        const ctx = canvas.current.getContext("2d");
        if (!ctx)
            return;

        canvas.current.width = window.innerWidth;
        canvas.current.height = window.innerHeight;

        for (let x = 0; x < Math.ceil(canvas.current.width / gridSquareSize); x++) {
            grid.push([]);
            for (let y = 0; y < Math.ceil(canvas.current.height / gridSquareSize); y++) {
                grid[x].push(false);
            }
        }

        setInterval(() => animate(ctx), 1000 / 60);
    }, [canvas.current]);

    function togglePlay() {
        isPlaying.current = !isPlaying.current;
        setPlaying(!playing);
    }

    function animate(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        if (isPlaying.current && frame % 10 === 0) {
            const tempGrid = structuredClone(grid);

            for (let x = 0; x < tempGrid.length; x++) {
                for (let y = 0; y < tempGrid[x].length; y++) {
                    let aliveNeighbors = 0;

                    if (grid[x - 1]?.[y - 1])
                        aliveNeighbors++;
                    if (grid[x - 1]?.[y])
                        aliveNeighbors++;
                    if (grid[x][y - 1])
                        aliveNeighbors++;
                    if (grid[x + 1]?.[y - 1])
                        aliveNeighbors++;
                    if (grid[x - 1]?.[y + 1])
                        aliveNeighbors++;
                    if (grid[x][y + 1])
                        aliveNeighbors++;
                    if (grid[x + 1]?.[y + 1])
                        aliveNeighbors++;
                    if (grid[x + 1]?.[y])
                        aliveNeighbors++;

                    if (aliveNeighbors < 2)
                        tempGrid[x][y] = false;
                    if (aliveNeighbors > 3)
                        tempGrid[x][y] = false;
                    if (aliveNeighbors === 3)
                        tempGrid[x][y] = true;
                }
            }

            grid = tempGrid;
        }

        ctx.fillStyle = colors.tertiary;
        for (let x = 0; x < grid.length; x++) {
            for (let y = 0; y < grid[x].length; y++) {
                if (grid[x][y])
                    ctx.fillRect(x * gridSquareSize, y * gridSquareSize, gridSquareSize, gridSquareSize);
            }
        }

        frame++;
    }

    return (<>
        <canvas className="absolute inset-0" ref={canvas} />

        <div className="absolute top-2 left-2 bg-bg-light rounded-lg p-2">
            <button className="rounded-lg p-2 bg-bg-lighter" onClick={togglePlay}>{playing ? <FaPause /> : <FaPlay />}</button>
        </div>
    </>);
}
