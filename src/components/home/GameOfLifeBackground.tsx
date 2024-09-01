"use client";

import { useEffect, useRef } from "react";

import { colors } from "@/lib/util";


export default function DotsBackground() {
    const canvas = useRef<HTMLCanvasElement>(null);

    let grid: boolean[][] = [];
    const gridSquareSize = 16;
    let animating = false;

    useEffect(() => {
        if (animating) return;
        if (!canvas.current) return;

        const ctx = canvas.current.getContext("2d");
        if (!ctx) return;

        canvas.current.width = window.innerWidth;
        canvas.current.height = window.innerHeight;

        window.addEventListener("resize", () => {
            canvas.current!.width = window.innerWidth;
            canvas.current!.height = window.innerHeight;
        });

        for (let x = 0; x < Math.ceil(canvas.current.width / gridSquareSize); x++) {
            grid.push([]);
            for (let y = 0; y < Math.ceil(canvas.current.height / gridSquareSize); y++) {
                grid[x].push(Math.random() > 0.75);
            }
        }

        setInterval(() => animate(ctx), 1000 / 15);
        animating = true;
    }, [canvas.current]);

    function animate(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        const tempGrid = structuredClone(grid);

        for (let x = 0; x < tempGrid.length; x++) {
            for (let y = 0; y < tempGrid[x].length; y++) {
                let aliveNeighbors = 0;

                if (grid[x - 1]?.[y - 1]) aliveNeighbors++;
                if (grid[x - 1]?.[y]) aliveNeighbors++;
                if (grid[x][y - 1]) aliveNeighbors++;
                if (grid[x + 1]?.[y - 1]) aliveNeighbors++;
                if (grid[x - 1]?.[y + 1]) aliveNeighbors++;
                if (grid[x][y + 1]) aliveNeighbors++;
                if (grid[x + 1]?.[y + 1]) aliveNeighbors++;
                if (grid[x + 1]?.[y]) aliveNeighbors++;

                if (aliveNeighbors < 2) tempGrid[x][y] = false;
                if (aliveNeighbors > 3) tempGrid[x][y] = false;
                if (aliveNeighbors === 3) tempGrid[x][y] = true;
            }
        }

        grid = tempGrid;

        ctx.fillStyle = colors.secondary;
        for (let x = 0; x < grid.length; x++) {
            for (let y = 0; y < grid[x].length; y++) {
                if (grid[x][y]) ctx.fillRect(x * gridSquareSize, y * gridSquareSize, gridSquareSize, gridSquareSize);
            }
        }
    }

    return (
        <canvas className="absolute inset-0 motion-reduce:hidden" ref={canvas} />
    );
}
