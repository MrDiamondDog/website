"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import Button from "@/components/general/Button";
import Divider from "@/components/general/Divider";
import Spinner from "@/components/general/Spinner";
import { map } from "@/lib/util";

const canvasWidth = 500;

type ImageRecognitionResult = {
    label: string;
    score: number;
    box: {
        xmin: number;
        ymin: number;
        xmax: number;
        ymax: number;
    }
};

export default function ImageRecognitionPage() {
    const [image, setImage] = useState<File | null>(null);
    const [results, setResults] = useState<ImageRecognitionResult[]>([]);
    const [selectedResult, setSelectedResult] = useState<ImageRecognitionResult | null>(null);
    const [loading, setLoading] = useState(false);
    const img = useRef<HTMLImageElement>();

    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvas.current || !image) return;

        const ctx = canvas.current.getContext("2d");
        if (!ctx) return;

        img.current = new Image();
        img.current.onload = () => {
            canvas.current.width = canvasWidth;
            canvas.current.height = img.current.height * (canvasWidth / img.current.width);
            ctx.drawImage(img.current, 0, 0, canvasWidth, img.current.height * (canvasWidth / img.current.width));
        };
        img.current.src = URL.createObjectURL(image);

        setResults([]);
    }, [image]);

    useEffect(() => {
        if (!canvas.current || !img.current) return;

        rerender();
    }, [results, selectedResult]);

    function rerender() {
        const ctx = canvas.current.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvasWidth, img.current.height * (canvasWidth / img.current.width));

        ctx.drawImage(img.current, 0, 0, canvasWidth, img.current.height * (canvasWidth / img.current.width));

        ctx.lineWidth = 2;
        ctx.strokeStyle = "red";
        ctx.font = "16px Arial";
        ctx.fillStyle = "red";

        for (const result of results.filter(r => r.score >= 0.01).slice(0, 10)) {
            if (selectedResult && selectedResult !== result) continue;

            // map the coordinates to the canvas size (input coords are from 0 to the original image size, NOT 0-1)
            const x = map(result.box.xmin, 0, img.current.width, 0, canvasWidth);
            const y = map(result.box.ymin, 0, img.current.height, 0, img.current.height * (canvasWidth / img.current.width));
            const width = map(result.box.xmax - result.box.xmin, 0, img.current.width, 0, canvasWidth);
            const height = map(result.box.ymax - result.box.ymin, 0, img.current.height, 0, img.current.height * (canvasWidth / img.current.width));

            ctx.strokeRect(x, y, width, height);
            ctx.fillText(`${result.label} (${(result.score * 100).toFixed(2)}%)`, x, y <= 20 ? y + 20 : y - 5);
        }
    }

    async function submit() {
        if (!canvas.current) return;

        setLoading(true);
        setResults([]);

        const res = await fetch("/api/ai/object-detection", {
            method: "POST",
            body: JSON.stringify({
                image: Array.from(new Uint8Array(await image.arrayBuffer())),
            }),
        });

        if (!res.ok) {
            console.error(await res.json());
            toast.error("Please try again later. If this issue persists after 24 hours, please contact me.");
            setLoading(false);
            return;
        }

        const json = await res.json();

        setResults(json.result);
        setLoading(false);
    }

    return (
        <div className="absolute-center border-[2px] border-primary rounded-lg bg-bg-light p-10 flex flex-row justify-between gap-5 items-center">
            <div>
                <h1>Terrible Image Recognition</h1>
                <Divider />
                <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
                <Button className="w-full mt-3" onClick={submit} disabled={loading}>Recognize</Button>
                <Divider />
                {loading && <Spinner />}
                {results.filter(r => r.score >= 0.01).slice(0, 10).map((result, i) => (
                    <div key={i} onMouseOver={() => setSelectedResult(result)} onMouseLeave={() => setSelectedResult(null)}>
                        <p className={selectedResult !== result && result !== null ? "text-gray-500" : ""}>{result.label} - {(result.score * 100).toFixed(2)}%</p>
                    </div>
                ))}
            </div>
            <div>
                <canvas width={canvasWidth} height="300" ref={canvas} className="bg-bg rounded-lg" />
            </div>
        </div>
    );
}
