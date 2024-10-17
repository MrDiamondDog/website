"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

import { initGame } from "./lib";

function Ultrakill1SPage() {
    const canvas = useRef<HTMLCanvasElement>(null);

    const init = useRef(false);
    useEffect(() => {
        if (!canvas.current || init.current) return;
        init.current = true;

        initGame(canvas.current);
    }, [canvas.current]);

    return (
        <canvas className="absolute inset-0" ref={canvas} />
    );
}

export default dynamic(() => Promise.resolve(Ultrakill1SPage), { ssr: false });
