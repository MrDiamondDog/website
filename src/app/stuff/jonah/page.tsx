"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

function JonahPage() {
    const canvas = useRef<HTMLCanvasElement>(null);

    function numBetween(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const jonahImage = new window.Image();
    jonahImage.src = "/images/jonah.webp";

    useEffect(() => {
        (async() => {
            const canvasElement = canvas.current as HTMLCanvasElement;
            if (!canvasElement)
                return;
            const ctx = canvasElement.getContext("2d") as CanvasRenderingContext2D;
            if (!ctx)
                return;

            canvasElement.width = canvasElement.clientWidth;
            canvasElement.height = canvasElement.clientHeight;

            function drawJonah(pos: { x: number, y: number }, size = 200) {
                ctx.drawImage(jonahImage, pos.x, pos.y, size, size);
            }

            function drawJonahParticles() {
                ctx.globalAlpha = 0.7;
                jonahParticles.forEach(particle => {
                    if (particle.dead)
                        return;
                    drawJonah(particle.pos, 25);
                });
                ctx.globalAlpha = 1;
            }

            const jonahPos = { x: canvasElement.width / 2, y: canvasElement.height / 2 };
            const jonahDir = { x: 5, y: 5 };

            const jonahParticles: any[] = [];

            function draw() {
                ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

                for (const particle of jonahParticles) {
                    particle.pos.x += particle.dir.x;
                    particle.pos.y += particle.dir.y;

                    particle.dir.y += 0.2;

                    if (particle.pos.y > canvasElement.height) {
                        particle.dead = true;
                    }
                }
                drawJonahParticles();

                jonahPos.x += jonahDir.x;
                jonahPos.y += jonahDir.y;

                if (jonahPos.x < 0 || jonahPos.x > canvasElement.width - 200) {
                    jonahDir.x *= -1;
                }

                if (jonahPos.y < 0 || jonahPos.y > canvasElement.height - 200) {
                    jonahDir.y *= -1;
                }

                drawJonah(jonahPos);

                requestAnimationFrame(draw);
            }

            canvasElement.addEventListener("click", e => {
                const mousePos = {
                    x: e.clientX - canvasElement.getBoundingClientRect().left,
                    y: e.clientY - canvasElement.getBoundingClientRect().top,
                };

                if (
                    mousePos.x >= jonahPos.x &&
                    mousePos.x <= jonahPos.x + 200 &&
                    mousePos.y >= jonahPos.y &&
                    mousePos.y <= jonahPos.y + 200
                ) {
                    for (const i of Array(10))
                        jonahParticles.push({
                            pos: { x: jonahPos.x + 100, y: jonahPos.y + 100 },
                            dir: { x: numBetween(-10, 10) + jonahDir.x, y: numBetween(-10, -5) + jonahDir.y },
                        });
                }
            });

            draw();
        })();
    }, [canvas.current]);

    return (<main>
        <div className="absolute top-0 left-0 w-[200vw] h-[200vh] flex flex-wrap gap-0">
            {[...Array(100)].map((_, i) => (
                <img src="/images/jonah.webp" alt="jonah" key={i} className="p-0 m-0" />
            ))}
        </div>

        <div className="absolute-center z-10">
            <h1 className="jonah-anim text-center">click that mf jonah!!!!!</h1>
            <canvas className="w-[50vw] h-[50vh]" ref={canvas} />
        </div>
    </main>);
}

export default dynamic(() => Promise.resolve(JonahPage), { ssr: false });
