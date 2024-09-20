"use client";

import { Bodies, Body, Composite, Events } from "matter-js";
import { useEffect, useRef, useState } from "react";

import DropdownToolbarButton from "@/components/games/physics/DropdownToolbarButton";
import SpawnableObject, { SpawnableObjectProps } from "@/components/games/physics/SpawnableObject";
import ToolbarButton from "@/components/games/physics/ToolbarButton";
import ToolbarDivider from "@/components/games/physics/ToolbarDivider";
import Input from "@/components/general/Input";
import Select from "@/components/general/Select";

import { initGame } from "./lib";
import { addBody, engine, mouseConstraint, render } from "./lib/matter";

const spawnableObjects: SpawnableObjectProps[] = [
    {
        name: "Box",
        spawn: pos => Bodies.rectangle(pos.x, pos.y, 80, 80),
    },
    {
        name: "Circle",
        spawn: pos => Bodies.circle(pos.x, pos.y, 40),
    },
    {
        name: "Polygon",
        spawn: (pos, options) => Bodies.polygon(pos.x, pos.y, options.Sides, 50),
        options: {
            Sides: {
                default: 3,
                min: 3,
                max: 30,
                step: 1,
            },
        }
    }
];

function StackSpawnDropdown() {
    const [shape, setShape] = useState("Shape");
    const [width, setWidth] = useState(2);
    const [height, setHeight] = useState(2);

    return (
        <DropdownToolbarButton title="Stack">
            <Select onChange={e => setShape(e.target.value)} value={shape}>
                <option value="Shape" disabled>Shape</option>
                {spawnableObjects.map(obj => (
                    <option key={obj.name} value={obj.name}>{obj.name}</option>
                ))}
            </Select>
            <Input type="range" min="2" max="20" step="1" label={`Width (${width})`} value={width} onChange={e => setWidth(parseInt(e.target.value))} />
            <Input type="range" min="2" max="20" step="1" label={`Height (${height})`} value={height} onChange={e => setHeight(parseInt(e.target.value))} />
            <ToolbarButton disabled={shape === "Shape"} onClick={() => {
                const spawn = () => {
                    if (render.mouse.button !== 0) return;

                    const pos = render.mouse.position;

                    for (let i = 0; i < width; i++) {
                        for (let j = 0; j < height; j++) {
                            const obj = spawnableObjects.find(obj => obj.name === shape);
                            if (!obj) return;

                            const body = obj.spawn({
                                x: pos.x + i * 80,
                                y: pos.y + j * 80,
                            }, {});

                            addBody(body);
                        }
                    }

                    Events.off(mouseConstraint, "mousedown", spawn);
                };
                Events.on(mouseConstraint, "mousedown", spawn);
            }}>Create</ToolbarButton>
        </DropdownToolbarButton>
    );
}

export default function PhysicsGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const loaded = useRef(false);

    useEffect(() => {
        if (!canvasRef.current || loaded.current) return;
        loaded.current = true;

        const canvas = canvasRef.current;
        initGame(canvas);
    }, [canvasRef]);

    return (<>
        <div className="absolute top-5 left-5 flex flex-row gap-2">
            <ToolbarButton onClick={() => {
                const clearBlock = Bodies.rectangle(-10000, 1000, 5000, 15000, { isStatic: true });

                addBody(clearBlock);

                const collisionCb = e => {
                    e.pairs.forEach(pair => {
                        if (pair.bodyA === clearBlock || pair.bodyB === clearBlock) {
                            if (pair.bodyA !== clearBlock) Composite.remove(engine.world, pair.bodyA);
                            if (pair.bodyB !== clearBlock) Composite.remove(engine.world, pair.bodyB);
                        }
                    });
                };

                Events.on(engine, "collisionStart", collisionCb);

                const cb = e => {
                    const timeScale = (e.delta || (1000 / 60)) / 1000;

                    Body.translate(clearBlock, { x: 10000 * timeScale, y: 0 });

                    if (clearBlock.position.x > 5000) {
                        Composite.remove(engine.world, clearBlock);
                        Events.off(engine, "beforeUpdate", cb);
                        Events.off(engine, "collisionStart", collisionCb);
                    }
                };

                Events.on(engine, "beforeUpdate", cb);
            }}>Clear</ToolbarButton>
            <ToolbarDivider />
            {spawnableObjects.map(obj => (
                <SpawnableObject key={obj.name} {...obj} />
            ))}
            <ToolbarDivider />
            <StackSpawnDropdown />
        </div>

        <canvas className="w-[100vw] h-[100vh]" ref={canvasRef} />
    </>);
}
