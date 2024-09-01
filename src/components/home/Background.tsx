"use client";

import { useEffect, useState } from "react";

import { randomRange } from "@/lib/util";

import DotsBackground from "./backgrounds/DotsBackground";
import GameOfLifeBackground from "./backgrounds/GameOfLifeBackground";
import GridBackground from "./backgrounds/GridBackground";

const backgrounds = [
    () => <DotsBackground />,
    () => <GameOfLifeBackground />,
    () => <GridBackground />
];

export default function Background() {
    const [index, setIndex] = useState(Math.floor(randomRange(0, backgrounds.length)));
    let started = false;

    let i = 0;
    function cycle() {
        i = i === backgrounds.length - 1 ? 0 : i + 1;
        setIndex(i);
    }

    useEffect(() => {
        if (started) return;
        started = true;

        setInterval(cycle, 7500);
    }, []);

    return (<>
        {backgrounds[index]?.()}
    </>);
}
