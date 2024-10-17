"use client";

import dynamic from "next/dynamic";
import { Vec2 } from "objective-canvas";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import ToolbarButton from "@/components/stuff/1-s/ToolbarButton";
import { devUrl, prodUrl } from "@/lib/contants";

import { game, gridColors, initGame, SquareColor, SquareType } from "./lib";
import { exportLevel } from "./lib/levels";

function Ultrakill1SPage() {
    const canvas = useRef<HTMLCanvasElement>(null);
    const bg = useRef<HTMLDivElement>(null);

    const levelData = location.search?.slice(1);
    const [isEditor, setEditor] = useState(!levelData ? true : location.hash.includes("editor"));

    const [color, setColor] = useState<SquareColor>("white");
    const [tool, setTool] = useState<SquareType | "eraser">("start");
    const [gridSize, setGridSize] = useState({ x: 3, y: 3 });

    const init = useRef(false);
    useEffect(() => {
        if (!canvas.current || init.current) return;
        init.current = true;

        initGame(canvas.current, bg.current, isEditor, levelData);
    }, [canvas.current]);

    useEffect(() => {
        if (!canvas.current) return;

        game.editor.selectedColor = color;
        game.editor.selectedTool = tool;
        game.currentLevel.gridSize = Vec2.from(gridSize.x ?? 3, gridSize.y ?? 3);

        if (!game.isEditor && isEditor) {
            for (let x = 0; x < game.currentLevel.gridSize.x; x++) {
                for (let y = 0; y < game.currentLevel.gridSize.y; y++) {
                    const square = game.currentLevel.grid[x][y];
                    if (!square) continue;

                    delete square.linePoints;
                }
            }

            bg.current.style.backgroundColor = "black";
        }

        game.isEditor = isEditor;
    }, [color, tool, isEditor, gridSize]);

    function reset() {
        location.search = "";
        location.reload();
    }

    function exportBoard() {
        const data = exportLevel(game.currentLevel);

        navigator.clipboard.writeText((process.env.NEXT_PUBLIC_PRODUCTION ? prodUrl : devUrl) + "/stuff/1-s?" + encodeURIComponent(data));

        toast("Share link copied to clipboard!");
    }

    return (
        <div className="absolute-center p-5 flex flex-col gap-2 justify-center items-center">
            <p><a href="#" onClick={reset}>New Level</a> | {isEditor ? <a href="#" onClick={() => setEditor(false)}>Play</a> : <a href="#" onClick={() => setEditor(true)}>Edit</a>} | <a href="#" onClick={exportBoard}>Export</a></p>
            <div className="p-5 bg-black" ref={bg}>
                <canvas ref={canvas} className="z-10" />
            </div>
            {isEditor && <div className="flex flex-col gap-2 justify-center items-center">
                <div className="flex flex-row gap-2">
                    <ToolbarButton onClick={() => setTool("start")} src={`/images/1-s/${color}/box-start.png`} selected={tool === "start"} />
                    <ToolbarButton onClick={() => setTool("end")} src={`/images/1-s/${color}/box-end.png`} selected={tool === "end"} />
                    <ToolbarButton onClick={() => setTool("dot")} src={`/images/1-s/${color}/dot.png`} selected={tool === "dot"} />
                    <ToolbarButton onClick={() => setTool("pit")} src={`/images/1-s/${color}/pit.png`} selected={tool === "pit"} />
                    <ToolbarButton onClick={() => setTool("void")} src="/images/1-s/void-icon.png" selected={tool === "void"} />
                    <ToolbarButton onClick={() => setTool("eraser")} src="/images/1-s/eraser-icon.png" selected={tool === "eraser"} />
                </div>
                <div className="flex flex-row gap-2">
                    <ToolbarButton selected={color === "white"} onClick={() => setColor("white")}><div style={{ backgroundColor: gridColors.white }} className="rounded-lg size-10" /></ToolbarButton>
                    <ToolbarButton selected={color === "red"} onClick={() => setColor("red")}><div style={{ backgroundColor: gridColors.red }} className="rounded-lg size-10" /></ToolbarButton>
                    <ToolbarButton selected={color === "blue"} onClick={() => setColor("blue")}><div style={{ backgroundColor: gridColors.blue }} className="rounded-lg size-10" /></ToolbarButton>
                    <ToolbarButton selected={color === "green"} onClick={() => setColor("green")}><div style={{ backgroundColor: gridColors.green }} className="rounded-lg size-10" /></ToolbarButton>
                </div>
                <div className="flex flex-row gap-2">
                    <input type="range" className="w-[120px]" min={2} max={8} placeholder="Width" value={gridSize.x} onChange={e => setGridSize({ ...gridSize, x: parseInt(e.target.value) })} />
                    <input type="range" className="w-[120px]" min={2} max={8} placeholder="Height" value={gridSize.y} onChange={e => setGridSize({ ...gridSize, y: parseInt(e.target.value) })} />
                </div>
            </div>}
        </div>
    );
}

export default dynamic(() => Promise.resolve(Ultrakill1SPage), { ssr: false });
