"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Vec2 } from "objective-canvas";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import Button from "@/components/general/Button";
import Dialog from "@/components/general/Dialog";
import Divider from "@/components/general/Divider";
import Input from "@/components/general/Input";
import Subtext from "@/components/general/Subtext";
import ToolbarButton from "@/components/stuff/1-s/ToolbarButton";

import { game, gridColors, initGame, Level, SquareColor, SquareType } from "./lib";
import { exportLevel } from "./lib/levels";

function Ultrakill1SPage() {
    const canvas = useRef<HTMLCanvasElement>(null);
    const bg = useRef<HTMLDivElement>(null);

    const router = useRouter();

    const [levelData, setLevelData] = useState<string>("");
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [levelsDialogOpen, setLevelsDialogOpen] = useState(false);

    const [ultrakillLevels, setUltrakillLevels] = useState<Record<string, Level[]>>({});

    const [isEditor, setEditor] = useState(!levelData ? true : location.hash.includes("editor"));

    const [color, setColor] = useState<SquareColor>("white");
    const [tool, setTool] = useState<SquareType | "eraser">("start");
    const [gridSize, setGridSize] = useState({ x: 3, y: 3 });

    const init = useRef(false);
    useEffect(() => {
        if (!canvas.current || init.current) return;
        init.current = true;

        initGame(canvas.current, bg.current, isEditor);

        fetch("/assets/1-s/ultrakill-levels.json")
            .then(res => res.json())
            .then((data: Record<string, string[]>) => {
                const levels: Record<string, Level[]> = {};

                for (const [name, levelDatas] of Object.entries(data)) {
                    for (const levelData of levelDatas) {
                        const level = JSON.parse(atob(levelData));
                        levels[name] = levels[name] ?? [];
                        levels[name].push(level);
                    }
                }

                console.log(levels);
                setUltrakillLevels(levels);
            });
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
        router.push("/stuff/1-s");
        location.reload();
    }

    function openExportMenu() {
        setShareDialogOpen(true);
        setLevelData(exportLevel(game.currentLevel));
    }

    function saveLevel() {
        const a = document.createElement("a");
        a.href = `data:text/plain,${levelData}`;
        a.download = "level.txt";
        a.click();
    }

    function loadFromFile() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".txt";
        input.onchange = () => {
            const file = input.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                setLevelData(reader.result as string);
                importBoard(reader.result as string);

                toast.success("Level loaded successfully!");
            };
            reader.readAsText(file);
        };
        input.click();
    }

    function importBoard(data?: string) {
        game.setLevel(JSON.parse(atob(data ?? levelData)));
        setGridSize({ x: game.currentLevel.gridSize.x, y: game.currentLevel.gridSize.y });
        game.updateCanvasSize();
    }

    return (<>
        <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} title="Export/Import Level" className="z-20">
            <Input label="Level Data" multiline="true" value={levelData} onChange={e => setLevelData(e.target.value)} className="w-[500px] h-[150px]" />
            <Button className="mt-2 w-full" onClick={() => { navigator.clipboard.writeText(levelData); toast.success("Copied!"); }}>Copy</Button>
            <Button className="mt-2 w-full" onClick={() => importBoard()}>Import from String</Button>
            <Button className="mt-2 w-full" onClick={saveLevel}>Save to File</Button>
            <Button className="mt-2 w-full" onClick={loadFromFile}>Load from File</Button>
        </Dialog>

        <Dialog open={levelsDialogOpen} onClose={() => setLevelsDialogOpen(false)} title="ULTRAKILL Levels" className="z-20">
            <Subtext>Choose a level from the original 1-S</Subtext>
            <Divider />
            {Object.entries(ultrakillLevels).map(([name, levels]) => <>
                <h3>{name}</h3>
                <div className="flex flex-row gap-1 mb-2">
                    {levels.map((level, i) => <Button key={i} className="p-2" onClick={() => {
                        game.setLevel(level);
                        setGridSize({ x: level.gridSize.x, y: level.gridSize.y });
                        game.updateCanvasSize();
                        setLevelsDialogOpen(false);
                        setEditor(false);
                    }}>{i + 1}</Button>)}
                </div>
            </>)}
        </Dialog>

        <div className="absolute-center p-5 flex flex-col gap-2 justify-center items-center">
            <div className="flex flex-row gap-2">
                {isEditor ? <a href="#" onClick={() => setEditor(false)}>Play</a> : <a href="#" onClick={() => setEditor(true)}>Edit</a>}
                |
                <a href="#" onClick={reset}>New Level</a>
                |
                <a href="#" onClick={() => setLevelsDialogOpen(true)}>Levels</a>
                |
                <a href="#" onClick={openExportMenu}>Import/Export</a>
            </div>
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
                    <input type="range" className="w-[120px]" step={1} min={1} max={8} placeholder="Width" value={gridSize.x} onChange={e => setGridSize({ ...gridSize, x: parseInt(e.target.value) })} />
                    <input type="range" className="w-[120px]" step={1} min={1} max={8} placeholder="Height" value={gridSize.y} onChange={e => setGridSize({ ...gridSize, y: parseInt(e.target.value) })} />
                </div>
            </div>}
        </div>
    </>);
}

export default dynamic(() => Promise.resolve(Ultrakill1SPage), { ssr: false });
