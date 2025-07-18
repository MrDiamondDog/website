"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import Button from "../general/Button";
import ColorSwatch from "../stuff/whiteboard/ColorSwatch";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SendADrawing() {
    const [minimized, setMinimized] = useState(true);

    const [selectedColor, setSelectedColor] = useState("");

    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvas.current)
            return;

        const ctx = canvas.current.getContext("2d")!;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.current.width, canvas.current.height);

        let isDrawing = false;
        let prevPos = { x: 0, y: 0 };

        canvas.current.addEventListener("mousedown", e => {
            isDrawing = true;
            prevPos = { x: e.offsetX, y: e.offsetY };
        });

        canvas.current.addEventListener("mousemove", e => {
            if (!isDrawing)
                return;

            ctx.beginPath();
            ctx.moveTo(prevPos.x, prevPos.y);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.lineWidth = 5;
            ctx.stroke();

            prevPos = { x: e.offsetX, y: e.offsetY };
        });

        canvas.current.addEventListener("mouseup", () => {
            isDrawing = false;
        });
    }, [canvas.current]);

    useEffect(() => {
        if (!canvas.current)
            return;

        const ctx = canvas.current.getContext("2d")!;
        ctx.strokeStyle = selectedColor;
    }, [selectedColor]);

    function clearCanvas() {
        if (!canvas.current)
            return;

        const ctx = canvas.current.getContext("2d")!;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.current.width, canvas.current.height);
        ctx.fillStyle = selectedColor;
    }

    async function sendCanvas() {
        if (!canvas.current)
            return;

        canvas.current.toBlob(async blob => {
            const res = await fetch("/api/drawing", {
                method: "POST",
                body: blob,
            });

            if (!res.ok)
                return void toast.error("Failed to send drawing");
            return void toast.success("Drawing sent!");
        });
    }

    return (
        <div className="rounded-lg bg-bg p-2 w-fit">
            <p
                onClick={() => setMinimized(!minimized)}
                className="flex flex-row gap-2 cursor-pointer justify-center items-center"
            >Send me a drawing! {minimized ? <ChevronDown /> : <ChevronUp />}</p>
            {!minimized && <>
                <canvas className="border-[3px] my-2 border-bg-light rounded-lg bg-white" width="350" height="350" ref={canvas} />
                <div className="flex flex-row gap-1 justify-center items-center">
                    <ColorSwatch color="red" selected={selectedColor === "red"} onClick={() => setSelectedColor("red")} />
                    <ColorSwatch color="orange" selected={selectedColor === "orange"} onClick={() => setSelectedColor("orange")} />
                    <ColorSwatch color="yellow" selected={selectedColor === "yellow"} onClick={() => setSelectedColor("yellow")} />
                    <ColorSwatch color="green" selected={selectedColor === "green"} onClick={() => setSelectedColor("green")} />
                    <ColorSwatch color="blue" selected={selectedColor === "blue"} onClick={() => setSelectedColor("blue")} />
                    <ColorSwatch color="purple" selected={selectedColor === "purple"} onClick={() => setSelectedColor("purple")} />
                    <ColorSwatch color="black" selected={selectedColor === "black"} onClick={() => setSelectedColor("black")} />
                    <ColorSwatch color="white" selected={selectedColor === "white"} onClick={() => setSelectedColor("white")} />
                </div>
                <div className="flex flex-row gap-2 mt-2">
                    <Button className="w-full !bg-bg-lighter" onClick={clearCanvas}>Clear</Button>
                    <Button className="w-full" onClick={sendCanvas}>Send</Button>
                </div>
            </>}
        </div>
    );
}
