"use client";

import dynamic from "next/dynamic";
import { Vec2 } from "objective-canvas";
import { useEffect, useRef, useState } from "react";
import { ChromePicker } from "react-color";
import { BiEraser, BiExport, BiPen, BiRedo, BiUndo } from "react-icons/bi";
import { CgArrowTopRight } from "react-icons/cg";
import { FaRegCircle } from "react-icons/fa6";
import { IoColorPaletteOutline } from "react-icons/io5";
import { LuShapes, LuSquare } from "react-icons/lu";
import { PiPaintBucketBold } from "react-icons/pi";
import { TbSlash } from "react-icons/tb";

import Button from "@/components/general/Button";
import Dialog from "@/components/general/Dialog";
import Input from "@/components/general/Input";
import Subtext from "@/components/general/Subtext";
import ColorSwatchTable from "@/components/stuff/whiteboard/ColorSwatchTable";
import ToolbarSeparator from "@/components/stuff/whiteboard/ToolbarSeparator";
import ToolButton from "@/components/stuff/whiteboard/ToolButton";

import { combinedSize, exportCanvas, initWhiteboard, redo, undo, whiteboard } from "./lib";
import dotBackground from "./lib/dotBackground";
import { Shape, Tool } from "./lib/types";

function WhiteboardPage() {
    const canvas = useRef<HTMLCanvasElement>(null);
    const backgroundCanvas = useRef<HTMLCanvasElement>(null);

    const hasInitialized = useRef(false);

    const [selectedTool, setSelectedTool] = useState<Tool>("pen");
    const [selectedShape, setSelectedShape] = useState<Shape>("line");
    const [shapeFill, setShapeFill] = useState(false);

    const [brushColor, setBrushColor] = useState("#ffffff");
    const [brushSize, setBrushSize] = useState(5);

    const [brushSettingsOpen, setBrushSettingsOpen] = useState(false);
    const [colorPickerOpen, setColorPickerOpen] = useState(false);

    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [exportTransparent, setExportTransparent] = useState(false);

    const [newCombinedSize, setNewCombinedSize] = useState(Vec2.zero());

    function exportImage() {
        const canvas = exportCanvas(exportTransparent);

        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = "whiteboard.png";
        a.click();
    }

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

    useEffect(() => {
        if (!exportDialogOpen) return;

        const size = combinedSize() as Vec2;
        setNewCombinedSize(size);
    }, [exportDialogOpen]);

    return (
        <main>
            {window.innerWidth < 768 && (
                <Dialog open={true} onClose={() => {}} title="Mobile User" className="z-[100]">
                    <p>This page does not work on mobile.</p>
                    <Button onClick={() => window.location.href = "/"} className="w-full">Home</Button>
                </Dialog>
            )}

            <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)} title="Export" className="z-[100]">
                <Subtext>Export options</Subtext>
                <Input type="checkbox" label="Transparent Background" onChange={e => setExportTransparent(e.target.checked)} checked={exportTransparent} />
                <ToolbarSeparator />
                {newCombinedSize.x !== -Infinity && <p>Resolution: {newCombinedSize.x} x {newCombinedSize.y}</p>}
                <Button onClick={exportImage} className="w-full" disabled={newCombinedSize.x === -Infinity}>Export</Button>
            </Dialog>

            <canvas ref={backgroundCanvas} width={window.innerWidth} height={window.innerHeight} className="bg-[red] absolute inset-0 -z-10" />
            <canvas ref={canvas} width={window.innerWidth} height={window.innerHeight} className="bg-transparent absolute inset-0" />

            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 flex flex-row gap-2 items-center justify-center z-20">
                <div className="bg-bg-light border border-bg-lighter rounded-r-lg p-1 flex flex-col gap-1 items-center justify-center">
                    <ToolButton icon={BiPen} onClick={() => setSelectedTool("pen")} selected={selectedTool === "pen"} />
                    <ToolButton icon={BiEraser} onClick={() => setSelectedTool("eraser")} selected={selectedTool === "eraser"} />
                    <ToolButton icon={LuShapes} onClick={() => setSelectedTool("shape")} selected={selectedTool === "shape"} />
                    <ToolbarSeparator />
                    <ToolButton icon={BiUndo} onClick={undo} />
                    <ToolButton icon={BiRedo} onClick={redo} />
                    <ToolbarSeparator />
                    <ToolButton icon={BiExport} onClick={() => setExportDialogOpen(true)} />
                </div>
                <div className="bg-bg-light rounded-lg p-1 flex flex-col gap-1 items-center justify-center relative">
                    <ToolButton onClick={() => setBrushSettingsOpen(!brushSettingsOpen)}>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: brushColor }} />
                    </ToolButton>


                    {(selectedTool === "shape") && (<>
                        <ToolbarSeparator />
                        <ToolButton icon={TbSlash} onClick={() => setSelectedShape("line")} selected={selectedShape === "line"} />
                        <ToolButton icon={CgArrowTopRight} onClick={() => setSelectedShape("arrow")} selected={selectedShape === "arrow"} />
                        <ToolButton icon={LuSquare} onClick={() => setSelectedShape("rectangle")} selected={selectedShape === "rectangle"} />
                        <ToolButton icon={FaRegCircle} onClick={() => setSelectedShape("circle")} selected={selectedShape === "circle"} />
                        <ToolbarSeparator />
                        <ToolButton icon={PiPaintBucketBold} onClick={() => setShapeFill(!shapeFill)} selected={shapeFill} />
                    </>)}



                    {brushSettingsOpen && (
                        <div className="absolute top-0 left-12 bg-bg-light border border-bg-lighter rounded-lg p-2 px-3 flex flex-col justify-center items-center">
                            <Subtext>Brush Size</Subtext>
                            <input type="range" min={1} max={100} value={brushSize} onChange={e => setBrushSize(parseInt(e.target.value))} />
                            <ToolbarSeparator className="my-2" />
                            <ColorSwatchTable colors={[
                                ["#ffffff", "#000000", "#FF0000", "#FF6666"],
                                ["#FF7F00", "#FFB266", "#FFFF00", "#FFFF66"],
                                ["#00FF00", "#66FF66", "#00FFFF", "#66FFFF"],
                                ["#0000FF", "#6666FF", "#8B00FF", "#B266FF"],
                                ["#FF00FF", "#FF66FF", "#FF1493", "#FF80BF"]
                            ]} onClick={color => setBrushColor(color)} selected={brushColor} />
                            <div className="relative">
                                <div className="rounded-full border border-bg-lighter w-8 h-8 flex justify-center items-center transition-all hover:bg-bg-lighter cursor-pointer" onClick={() => setColorPickerOpen(!colorPickerOpen)}>
                                    <IoColorPaletteOutline />
                                </div>

                                {colorPickerOpen && (
                                    <ChromePicker color={brushColor} onChange={color => setBrushColor(color.hex)} className="absolute bottom-full left-1/2 color-picker" />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default dynamic(async () => WhiteboardPage, { ssr: false });
