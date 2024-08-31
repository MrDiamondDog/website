"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// waiter! waiter! one pandemonium door 30 please!
// play my minigames - pandemonium

function Page() {
    const canvas = useRef<HTMLCanvasElement>();
    const energyBar = useRef<HTMLDivElement>();

    const [audio, setAudio] = useState(false);
    const router = useRouter();

    function numBetween(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const pandemoniumImage = new window.Image();
    pandemoniumImage.src = "/images/pandemonium/pandemonium.png";

    useEffect(() => {
        const canvasElement = canvas.current as HTMLCanvasElement;
        if (!canvasElement) return;
        const ctx = canvasElement.getContext("2d") as CanvasRenderingContext2D;
        if (!ctx) return;

        canvasElement.width = canvasElement.clientWidth;
        canvasElement.height = canvasElement.clientHeight;

        function drawPandy(pos: { x: number, y: number }, size = 200) {
            ctx.drawImage(pandemoniumImage, pos.x, pos.y, size, size);
        }

        function drawPandyParticles() {
            ctx.globalAlpha = 0.7;
            pandyParticles.forEach(particle => {
                if (particle.dead) return;
                drawPandy(particle.pos, 25);
            });
            ctx.globalAlpha = 1;
        }

        const pandyPos = { x: canvasElement.width / 2, y: canvasElement.height / 2 };
        const pandyDir = { x: 5, y: 5 };
        let energy = 200;

        const pandyParticles: any[] = [];

        function draw() {
            ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

            for (const particle of pandyParticles) {
                particle.pos.x += particle.dir.x;
                particle.pos.y += particle.dir.y;

                particle.dir.y += 0.2;

                if (particle.pos.y > canvasElement.height) {
                    particle.dead = true;
                }
            }
            drawPandyParticles();

            pandyPos.x += pandyDir.x;
            pandyPos.y += pandyDir.y;

            pandyDir.x += Math.sign(pandyDir.x) * 0.0025;
            pandyDir.y += Math.sign(pandyDir.y) * 0.0025;

            energy--;
            energyBar.current.style.width = energy + "px";

            if (energy === 0) router.push("/");
            if (energy >= 200) energy = 200;

            if (energy < 75) energyBar.current.style.backgroundColor = "red";
            else energyBar.current.style.backgroundColor = "white";

            if (pandyPos.x < 0 || pandyPos.x > canvasElement.width - 200) {
                pandyDir.x *= -1;
            }

            if (pandyPos.y < 0 || pandyPos.y > canvasElement.height - 200) {
                pandyDir.y *= -1;
            }

            drawPandy(pandyPos);

            requestAnimationFrame(draw);
        }

        canvasElement.addEventListener("click", e => {
            setAudio(true);
            const mousePos = {
                x: e.clientX - canvasElement.getBoundingClientRect().left,
                y: e.clientY - canvasElement.getBoundingClientRect().top
            };

            if (mousePos.x >= pandyPos.x && mousePos.x <= pandyPos.x + 200 && mousePos.y >= pandyPos.y && mousePos.y <= pandyPos.y + 200) {
                energy += 15;
                for (const i of Array(10))
                    pandyParticles.push({
                        pos: { x: pandyPos.x + 100, y: pandyPos.y + 100 },
                        dir: { x: numBetween(-10, 10) + pandyDir.x, y: numBetween(-10, -5) + pandyDir.y },
                    });
            }
        });

        draw();
    }, []);

    return (<>
        {audio && <audio src="/images/pandemonium/pandemonium.MP3" autoPlay controls={false} loop />}
        <div className="absolute-center flex flex-col justify-center items-center">
            <h1>click that mf pandemonium!!!!!</h1>
            <div className="h-[15px]" style={{ backgroundColor: "white", width: "200px" }} ref={energyBar}></div>
        </div>
        <div className="absolute-center">
            <canvas className="w-[100vw] h-[100vh]" ref={canvas} />
        </div>
    </>);
}

export default dynamic(() => Promise.resolve(Page), { ssr: false });
