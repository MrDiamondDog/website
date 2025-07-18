"use client";

import { useEffect, useRef } from "react";

import Subtext from "@/components/general/Subtext";
import { colors, Vec2 } from "@/lib/util";

export default function DotsBackground() {
    const canvas = useRef<HTMLCanvasElement>(null);

    const dots: { pos: Vec2; vel: Vec2; connections: number }[] = [];

    const started = useRef(false);

    useEffect(() => {
        if (started.current)
            return;
        started.current = true;
        if (!canvas.current)
            return;

        const ctx = canvas.current.getContext("2d");
        if (!ctx)
            return;

        canvas.current.width = window.innerWidth;
        canvas.current.height = window.innerHeight;

        let numDots = 100;
        if (window.innerWidth < 768)
            numDots = 50;

        for (let i = 0; i < numDots; i++) {
            dots.push({
                pos: {
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                },
                vel: {
                    x: Math.random() * 1.5 - 1,
                    y: Math.random() * 1.5 - 1,
                },
                connections: 0,
            });
        }

        animate(ctx);
    }, [canvas.current]);

    function animate(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (const dot of dots) {
            ctx.beginPath();
            ctx.arc(dot.pos.x, dot.pos.y, 2, 0, 2 * Math.PI);
            ctx.fillStyle = colors.secondary;
            ctx.fill();

            dot.connections = 0;

            for (const other of dots) {
                if (dot === other)
                    continue;
                if (other.connections > 3)
                    continue;

                const dx = other.pos.x - dot.pos.x;
                const dy = other.pos.y - dot.pos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(dot.pos.x, dot.pos.y);
                    ctx.lineTo(other.pos.x, other.pos.y);
                    ctx.strokeStyle = colors.tertiary;
                    ctx.stroke();

                    dot.connections++;
                }

                if (dot.connections > 3)
                    break;
            }

            dot.pos.x += dot.vel.x;
            dot.pos.y += dot.vel.y;

            if (dot.pos.x < 0)
                dot.pos.x = window.innerWidth;
            if (dot.pos.x > window.innerWidth)
                dot.pos.x = 0;
            if (dot.pos.y < 0)
                dot.pos.y = window.innerHeight;
            if (dot.pos.y > window.innerHeight)
                dot.pos.y = 0;
        }

        requestAnimationFrame(() => animate(ctx));
    }

    return (<>
        <canvas className="absolute inset-0 motion-reduce:hidden blur-sm" ref={canvas} />
        <Subtext className="absolute-center !top-5 hidden motion-reduce:block">
        There's usually a cool background here, but it has been hidden based on your preferences.
        </Subtext>
    </>);
}
