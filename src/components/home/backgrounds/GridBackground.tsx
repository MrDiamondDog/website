"use client";

import { useEffect, useRef } from "react";

import Subtext from "@/components/general/Subtext";
import { colors, randomRange } from "@/lib/util";

export default function GridBackground() {
    const canvas = useRef<HTMLCanvasElement>(null);

    const grid: { value: number, dir: number }[][] = [];
    const gridSquareSize = { x: 64, y: 32 };
    let started = false;

    useEffect(() => {
        if (started) return;
        started = true;
        if (!canvas.current) return;

        const ctx = canvas.current.getContext("2d");
        if (!ctx) return;

        canvas.current.width = window.innerWidth;
        canvas.current.height = window.innerHeight;

        for (let x = 0; x < Math.ceil(canvas.current.width / gridSquareSize.x); x++) {
            grid.push([]);
            for (let y = 0; y < Math.ceil(canvas.current.height / gridSquareSize.y); y++) {
                grid[x].push({ value: Math.random(), dir: randomRange(-0.02, 0.02) });
            }
        }
        animate(ctx);
    }, [canvas.current]);

    let frames = 0;
    function animate(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        if (frames % 2 === 0) {
            for (let x = 0; x < grid.length; x++) {
                for (let y = 0; y < grid[x].length; y++) {
                    if (grid[x][y].value <= 0) {
                        grid[x][y].value = 0;
                        grid[x][y].dir = -grid[x][y].dir;
                    } else if (grid[x][y].value >= 1) {
                        grid[x][y].value = 1;
                        grid[x][y].dir = -grid[x][y].dir;
                    }
                    grid[x][y].value += grid[x][y].dir;
                }
            }
        }

        ctx.fillStyle = colors.tertiary;
        for (let x = 0; x < grid.length; x++) {
            for (let y = 0; y < grid[x].length; y++) {
                ctx.globalAlpha = Math.max(0, Math.min(1, grid[x][y].value));
                ctx.fillRect(x * gridSquareSize.x, y * gridSquareSize.y, gridSquareSize.x, gridSquareSize.y);
            }
        }

        frames++;
        requestAnimationFrame(() => animate(ctx));
    }

    return (<>
        <canvas className="absolute inset-0 motion-reduce:hidden" ref={canvas} />
        <Subtext className="absolute-center !top-5 hidden motion-reduce:block">There's usually a cool background here, but it has been hidden based on your preferences.</Subtext>
    </>);
}
