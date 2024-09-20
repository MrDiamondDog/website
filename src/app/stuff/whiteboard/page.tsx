"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ChromePicker } from "react-color";
import { BiEraser, BiPen } from "react-icons/bi";
import { FaRegCircle } from "react-icons/fa6";
import { LuShapes, LuSquare } from "react-icons/lu";
import { PiPaintBucketBold } from "react-icons/pi";
import { TbSlash } from "react-icons/tb";

import ToolButton from "@/components/stuff/whiteboard/ToolButton";

import { initWhiteboard, whiteboard } from "./lib";
import dotBackground from "./lib/dotBackground";
import { Shape, Tool } from "./lib/types";

function WhiteboardPage() {
    const canvas = useRef<HTMLCanvasElement>(null);
    const backgroundCanvas = useRef<HTMLCanvasElement>(null);

    const hasInitialized = useRef(false);

    const [selectedTool, setSelectedTool] = useState<Tool>("pen");
    const [selectedShape, setSelectedShape] = useState<Shape>("line");
    const [shapeFill, setShapeFill] = useState(false);

    const [brushColor, setBrushColor] = useState("#E2E2E2");
    const [brushSize, setBrushSize] = useState(5);

    const [colorPickerOpen, setColorPickerOpen] = useState(false);
    const [sizePickerOpen, setSizePickerOpen] = useState(false);

    useEffect(() => {
        if (!canvas.current || hasInitialized.current) return;
        hasInitialized.current = true;

        initWhiteboard(canvas.current);

        const ctx = backgroundCanvas.current?.getContext("2d");

        function drawBackground() {
            if (!ctx) return;

            dotBackground(ctx);

            requestAnimationFrame(drawBackground);
        }

        drawBackground();
    }, []);

    useEffect(() => {
        if (!canvas.current) return;

        whiteboard.selectedTool = selectedTool;
        whiteboard.selectedShape = selectedShape;
        whiteboard.shapeFill = shapeFill;

        whiteboard.brushColor = brushColor;
        whiteboard.brushSize = brushSize;
    }, [selectedTool, selectedShape, shapeFill, brushColor, brushSize]);

    return (
        <main>
            <canvas ref={backgroundCanvas} width={window.innerWidth} height={window.innerHeight} className="bg-[red] absolute inset-0 -z-10" />
            <canvas ref={canvas} width={window.innerWidth} height={window.innerHeight} className="bg-transparent absolute inset-0" />

            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 flex flex-row gap-2 items-center justify-center">
                <div className="bg-bg-light border border-bg-lighter rounded-r-lg p-1 flex flex-col gap-1 items-center justify-center">
                    <ToolButton icon={BiPen} onClick={() => setSelectedTool("pen")} selected={selectedTool === "pen"} />
                    <ToolButton icon={BiEraser} onClick={() => setSelectedTool("eraser")} selected={selectedTool === "eraser"} />
                    <ToolButton icon={LuShapes} onClick={() => setSelectedTool("shape")} selected={selectedTool === "shape"} />
                </div>
                <div className="bg-bg-light rounded-lg p-1 flex flex-col gap-1 items-center justify-center relative">
                    <ToolButton onClick={() => setColorPickerOpen(!colorPickerOpen)}>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: brushColor }} />
                    </ToolButton>

                    <ToolButton className="relative overflow-hidden size-full aspect-square" onClick={() => setSizePickerOpen(!sizePickerOpen)}>
                        <div style={{ width: brushSize * 2, height: brushSize * 2 }} className="rounded-full absolute-center bg-[white]" />
                    </ToolButton>

                    {(selectedTool === "shape") && (<>
                        <ToolButton icon={TbSlash} onClick={() => setSelectedShape("line")} selected={selectedShape === "line"} />
                        <ToolButton icon={LuSquare} onClick={() => setSelectedShape("rectangle")} selected={selectedShape === "rectangle"} />
                        <ToolButton icon={FaRegCircle} onClick={() => setSelectedShape("circle")} selected={selectedShape === "circle"} />
                        <ToolButton icon={PiPaintBucketBold} onClick={() => setShapeFill(!shapeFill)} selected={shapeFill} />
                    </>)}

                    {colorPickerOpen && (
                        <ChromePicker color={brushColor} onChange={color => setBrushColor(color.hex)} className="absolute top-0 left-10 z-20 color-picker" />
                    )}

                    {sizePickerOpen && (
                        <div className="absolute top-0 left-10 z-20 bg-bg-light border border-bg-lighter rounded-lg p-2 px-3 flex justify-center items-center">
                            <input type="range" min={1} max={20} value={brushSize} onChange={e => setBrushSize(parseInt(e.target.value))} />
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default dynamic(async () => WhiteboardPage, { ssr: false });
