"use client";

import { Bodies, Body } from "matter-js";
import { useEffect, useRef } from "react";

import SpawnableObject from "@/components/games/physics/SpawnableObject";
import ToolbarButton from "@/components/games/physics/ToolbarButton";
import ToolbarDivider from "@/components/games/physics/ToolbarDivider";

import { initGame } from "./lib";
import { ground } from "./lib/matter";

export default function PhysicsGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    let loaded = false;

    useEffect(() => {
        if (!canvasRef.current || loaded) return;
        loaded = true;

        const canvas = canvasRef.current;
        initGame(canvas);
    }, [canvasRef]);

    return (<>
        <div className="absolute top-5 left-5 flex flex-row gap-2">
            <ToolbarButton onClick={() => {
                let rotation = 0;
                const interval = setInterval(() => {
                    rotation += 0.05;
                    Body.rotate(ground, 0.05);

                    if (rotation >= Math.PI / 2) {
                        clearInterval(interval);

                        rotation = 0;
                        setTimeout(() => {
                            const interval = setInterval(() => {
                                rotation += 0.05;
                                Body.rotate(ground, -0.05);

                                if (rotation >= Math.PI / 2) {
                                    clearInterval(interval);
                                }
                            }, 1000 / 60);
                        }, 3000);
                    }
                }, 1000 / 60);
            }}>Clear</ToolbarButton>
            <ToolbarDivider />
            <SpawnableObject name="Box" spawn={pos => Bodies.rectangle(pos.x, pos.y, 80, 80)} />
            <SpawnableObject name="Circle" spawn={pos => Bodies.circle(pos.x, pos.y, 40)} />
            <SpawnableObject name="Triangle" spawn={pos => Bodies.polygon(pos.x, pos.y, 3, 50)} />
        </div>

        <canvas className="w-[100vw] h-[100vh]" ref={canvasRef} />
    </>);
}
