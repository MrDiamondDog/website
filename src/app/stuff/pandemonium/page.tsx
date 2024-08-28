"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import Button from "@/components/general/Button";
import DVDLogo from "@/components/general/DVDLogo";

function Page() {
    const [entered, setEntered] = useState(false);
    const [clicker, setClicker] = useState(false);
    const canvas = useRef<HTMLCanvasElement>();

    function numBetween(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const pandemoniumImage = new window.Image();
    pandemoniumImage.src = "/images/pandemonium/pandemonium.png";

    useEffect(() => {
        if (!entered) return;
        setTimeout(() => {
            setClicker(true);
        }, 10000);

        setTimeout(() => {
            (async () => {
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
                    const mousePos = {
                        x: e.clientX - canvasElement.getBoundingClientRect().left,
                        y: e.clientY - canvasElement.getBoundingClientRect().top
                    };

                    if (mousePos.x >= pandyPos.x && mousePos.x <= pandyPos.x + 200 && mousePos.y >= pandyPos.y && mousePos.y <= pandyPos.y + 200) {
                        for (const i of Array(10))
                            pandyParticles.push({
                                pos: { x: pandyPos.x + 100, y: pandyPos.y + 100 },
                                dir: { x: numBetween(-10, 10) + pandyDir.x, y: numBetween(-10, -5) + pandyDir.y },
                            });
                    }
                });

                draw();
            })();
        }, 10100);
    }, [entered]);

    return (<>
        {!entered && <Button onClick={() => setEntered(true)}>Enter</Button>}
        {entered && <div style={{ backgroundImage: "url(/images/pandemonium/pandemonium.png)", backgroundSize: "200px" }} className="bg-repeat absolute inset-0 p-20 overflow-hidden">
            <video src="/images/pandemonium/expendable at door 30.MP3" autoPlay controls={false} loop />
            <video src="/images/pandemonium/pandemonium.mp3" autoPlay controls={false} loop />
            <DVDLogo><img src="https://media1.tenor.com/m/WNA4QXJBMwUAAAAC/pandemonium-pandemonium-pressure.gif" /></DVDLogo>
            <DVDLogo><img src="https://pbs.twimg.com/media/GVfTRYgXoAArrIn?format=png&name=small" /></DVDLogo>
            <DVDLogo><video muted controls={false} autoPlay loop src="/images/pandemonium/pandemonium-pitbull.mp4" /></DVDLogo>
            <DVDLogo><video muted controls={false} autoPlay loop src="/images/pandemonium/pandemonium-gambling.mp4" /></DVDLogo>
            <DVDLogo><video muted controls={false} autoPlay loop src="/images/pandemonium/pandemonium-ravaging.mp4" /></DVDLogo>
            <DVDLogo><video muted controls={false} autoPlay loop src="/images/pandemonium/pandemoniums.mp4" /></DVDLogo>
            <DVDLogo><video muted controls={false} autoPlay loop src="/images/pandemonium/pandemonium-chase.mp4" /></DVDLogo>
            <DVDLogo><video muted controls={false} autoPlay loop src="/images/pandemonium/pandemonium-prank.mp4" /></DVDLogo>
        </div>}

        {clicker && <div className="absolute-center z-10 bg-[rgba(0,0,0,0.5)]">
            <h1 className="jonah-anim text-center">click that mf pandemonium!!!!!</h1>
            <canvas className="w-[50vw] h-[50vh]" ref={canvas} />
        </div>}
    </>);
}

export default dynamic(() => Promise.resolve(Page), { ssr: false });
