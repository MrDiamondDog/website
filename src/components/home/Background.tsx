"use client";

import { useEffect, useRef, useState } from "react";
import { FaEye } from "react-icons/fa6";

import { randomRange } from "@/lib/util";

import DotsBackground from "./backgrounds/DotsBackground";

const backgrounds = [
    () => <DotsBackground />,
    // () => <GameOfLifeBackground />,
    // () => <GridBackground />
];

export default function Background() {
    const [visible, setVisible] = useState(true);

    const [index, setIndex] = useState(Math.floor(randomRange(0, backgrounds.length)));
    const started = useRef(false);

    let i = 0;
    function cycle() {
        i = i === backgrounds.length - 1 ? 0 : i + 1;
        setIndex(i);
    }

    useEffect(() => {
        if (started.current) return;
        started.current = true;

        setInterval(cycle, 7500);
    }, []);

    return (<>
        <div className="absolute top-2 right-2 text-gray-500 cursor-pointer z-10" onClick={() => setVisible(!visible)}><FaEye size={24} /></div>
        {visible && backgrounds[index]?.()}
    </>);
}
