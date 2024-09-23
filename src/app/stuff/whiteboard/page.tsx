"use client";

import { APIUser } from "discord-api-types/v10";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { objects, Vec2 } from "objective-canvas";
import { useCallback,useEffect, useReducer, useRef } from "react";
import { ChromePicker } from "react-color";
import { BiCog, BiEraser, BiExport, BiPen, BiRedo, BiUndo } from "react-icons/bi";
import { CgArrowTopRight } from "react-icons/cg";
import { FaRegCircle } from "react-icons/fa6";
import { IoMdCode, IoMdTime } from "react-icons/io";
import { IoColorPaletteOutline } from "react-icons/io5";
import { LuShapes, LuSquare } from "react-icons/lu";
import { MdOutlinePeople } from "react-icons/md";
import { PiPaintBucketBold } from "react-icons/pi";
import { TbSlash } from "react-icons/tb";
import { toast } from "sonner";

import Button from "@/components/general/Button";
import Dialog from "@/components/general/Dialog";
import DiscordAuthBarrier from "@/components/general/DiscordUser";
import Divider from "@/components/general/Divider";
import Input from "@/components/general/Input";
import Spinner from "@/components/general/Spinner";
import Subtext from "@/components/general/Subtext";
import ColorSwatchTable from "@/components/stuff/whiteboard/ColorSwatchTable";
import ToolbarSeparator from "@/components/stuff/whiteboard/ToolbarSeparator";
import ToolButton from "@/components/stuff/whiteboard/ToolButton";

import { combinedSize, debug, exportCanvas, initWhiteboard, redo, setDebug, setProfiler, undo, whiteboard } from "./lib";
import dotBackground from "./lib/dotBackground";
import { MultiplayerObject } from "./lib/multiplayerObject";
import { ShapeObject } from "./lib/shapeObject";
import { StrokeObject } from "./lib/strokeObject";

const wsUrl = process.env.NEXT_PUBLIC_PRODUCTION
    ? "wss://server.mrdiamond.is-a.dev"
    : "ws://localhost:8080";

const initialState = {
    selectedTool: "pen",
    selectedShape: "line",

    shapeFill: false,
    brushColor: "#ffffff",
    brushSize: 5,

    brushSettingsOpen: false,
    colorPickerOpen: false,

    exportDialogOpen: false,
    exportTransparent: false,

    settingsOpen: false,
    debugOn: false,
    profilerOn: false,

    newCombinedSize: Vec2.zero(),

    multiplayer: false,
    multiplayerDialogOpen: false,
    isHost: false,
    roomCode: "",
    roomCodeInput: "",
    user: null as APIUser | null,
    loading: false,
    ws: null as WebSocket | null,
    wsReady: false,
};

function whiteboardReducer(state: typeof initialState, action: { type: string, payload?: any }) {
    switch (action.type) {
        case "SET_TOOL":
            return { ...state, selectedTool: action.payload };
        case "SET_SHAPE":
            return { ...state, selectedShape: action.payload };
        case "TOGGLE_FILL":
            return { ...state, shapeFill: !state.shapeFill };
        case "SET_BRUSH_COLOR":
            return { ...state, brushColor: action.payload };
        case "SET_BRUSH_SIZE":
            return { ...state, brushSize: action.payload };
        case "TOGGLE_BRUSH_SETTINGS":
            return { ...state, brushSettingsOpen: !state.brushSettingsOpen };
        case "TOGGLE_COLOR_PICKER":
            return { ...state, colorPickerOpen: !state.colorPickerOpen };
        case "TOGGLE_EXPORT_DIALOG":
            return { ...state, exportDialogOpen: !state.exportDialogOpen };
        case "TOGGLE_TRANSPARENT_EXPORT":
            return { ...state, exportTransparent: !state.exportTransparent };
        case "TOGGLE_SETTINGS":
            return { ...state, settingsOpen: !state.settingsOpen };
        case "TOGGLE_DEBUG":
            return { ...state, debugOn: !state.debugOn };
        case "TOGGLE_PROFILER":
            return { ...state, profilerOn: !state.profilerOn };
        case "SET_COMBINED_SIZE":
            return { ...state, newCombinedSize: action.payload };
        case "TOGGLE_MULTIPLAYER":
            return { ...state, multiplayer: !state.multiplayer };
        case "TOGGLE_MULTIPLAYER_DIALOG":
            return { ...state, multiplayerDialogOpen: !state.multiplayerDialogOpen };
        case "SET_USER":
            return { ...state, user: action.payload };
        case "SET_ROOM_CODE":
            return { ...state, roomCode: action.payload };
        case "SET_ROOM_CODE_INPUT":
            return { ...state, roomCodeInput: action.payload };
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        case "SET_WS":
            return { ...state, ws: action.payload };
        case "SET_WS_READY":
            return { ...state, wsReady: action.payload };
        default:
            return state;
    }
}

function WhiteboardPage() {
    const canvas = useRef<HTMLCanvasElement>(null);
    const backgroundCanvas = useRef<HTMLCanvasElement>(null);
    const hasInitialized = useRef(false);

    const [state, dispatch] = useReducer(whiteboardReducer, initialState);

    const searchParams = useSearchParams();

    const opened = useRef(false);
    if (searchParams.has("roomCode") && !state.multiplayerDialogOpen && !opened.current) {
        opened.current = true;
        dispatch({ type: "SET_ROOM_CODE_INPUT", payload: searchParams.get("roomCode") });
        dispatch({ type: "TOGGLE_MULTIPLAYER_DIALOG" });
    }
    else if (searchParams.has("code") && !state.multiplayerDialogOpen && !opened.current) {
        opened.current = true;
        dispatch({ type: "TOGGLE_MULTIPLAYER_DIALOG" });
    }

    const exportImage = useCallback(() => {
        debug("export", "starting export");
        const canvas = exportCanvas(state.exportTransparent);
        debug("export", "downloading");

        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = "whiteboard.png";
        a.click();
    }, [state.exportTransparent]);

    // Initialize whiteboard and background only once
    useEffect(() => {
        if (!canvas.current || hasInitialized.current) return;
        hasInitialized.current = true;

        debug("init", "initializing whiteboard");
        initWhiteboard(canvas.current);

        const ctx = backgroundCanvas.current?.getContext("2d");
        if (!ctx) return;

        const drawBackground = () => {
            dotBackground(ctx);
            requestAnimationFrame(drawBackground);
        };

        drawBackground();
    }, []);

    // Update whiteboard settings whenever state changes
    useEffect(() => {
        if (!canvas.current) return;

        whiteboard.selectedTool = state.selectedTool;
        whiteboard.selectedShape = state.selectedShape;
        whiteboard.shapeFill = state.shapeFill;

        whiteboard.brushColor = state.brushColor;
        whiteboard.brushSize = state.brushSize;

        setDebug(state.debugOn);
        setProfiler(state.profilerOn);
    }, [state.selectedTool, state.selectedShape, state.shapeFill, state.brushColor, state.brushSize, state.debugOn, state.profilerOn]);

    useEffect(() => {
        if (!state.exportDialogOpen) return;
        const size = combinedSize() as Vec2;
        dispatch({ type: "SET_COMBINED_SIZE", payload: size });
    }, [state.exportDialogOpen]);


    function joinMultiplayer(hosting = false, roomCode?: string) {
        if (!state.user) return;

        debug("ws", "connecting");

        dispatch({ type: "SET_LOADING", payload: true });

        const ws = new WebSocket(wsUrl);
        dispatch({ type: "SET_WS", payload: ws });

        ws.addEventListener("open", () => {
            debug("ws", "opened");

            dispatch({ type: "SET_WS_READY", payload: true });

            ws.send(JSON.stringify({ type: "connect", route: "whiteboard" }));
        });

        ws.addEventListener("message", e => {
            const json = JSON.parse(e.data);

            if (json.type === "connected") {
                debug("ws", "connected");

                if (hosting) ws.send(JSON.stringify({ type: "host", id: state.user.id }));
                else ws.send(JSON.stringify({ type: "join", roomCode: roomCode ?? state.roomCodeInput, name: state.user.username, id: state.user.id }));
            } else if (json.type === "joined") {
                debug("ws", "joined", json.room.roomCode);

                objects.unshift(new MultiplayerObject());

                objects.push(...json.room.objects);
                whiteboard.users = json.room.users;
                whiteboard.ws = ws;
                whiteboard.roomCode = json.room.roomCode;
                whiteboard.user = state.user;

                dispatch({ type: "SET_LOADING", payload: false });
                dispatch({ type: "SET_ROOM_CODE", payload: json.room.roomCode });
                dispatch({ type: "SET_MULTIPLAYER", payload: true });
                dispatch({ type: "SET_ROOM_CODE_INPUT", payload: "" });

                if (hosting) dispatch({ type: "SET_IS_HOST", payload: true });
                else dispatch({ type: "TOGGLE_MULTIPLAYER_DIALOG" });
            } else if (json.type === "user joined") {
                debug("ws", "user joined", json.name, json.id);

                toast(`${json.name} joined the room!`);

                whiteboard.users.push({ name: json.name, id: json.id, color: json.color, mousePos: Vec2.zero() });
            } else if (json.type === "mousemove") {
                debug("ws", "mousemove", json.x, json.y);

                const user = whiteboard.users.find(user => user.id === json.id);
                if (!user) return;

                user.mousePos = new Vec2(json.x, json.y);
            } else if (json.type === "stroke") {
                debug("ws", "stroke", json.stroke);

                if (json.shape)
                    objects.push(new ShapeObject(json.stroke));
                else
                    objects.push(new StrokeObject(json.stroke));
            } else if (json.type === "host room code") {
                debug("ws", "host room code", json.roomCode);

                ws.send(JSON.stringify({ type: "join", roomCode: json.roomCode, name: state.user.username, id: state.user.id }));
            } else if (json.type === "user left") {
                debug("ws", "user left", json.id);

                toast(`${whiteboard.users.find(user => user.id === json.id)?.name} left the room!`);

                whiteboard.users = whiteboard.users.filter(user => user.id !== json.id);
            }
        });

        ws.addEventListener("close", () => {
            dispatch({ type: "SET_WS_READY", payload: false });
            dispatch({ type: "SET_LOADING", payload: false });
        });
    }

    function leaveMultiplayer() {
        if (!state.ws) return;

        state.ws.close();
        dispatch({ type: "SET_WS", payload: null });
        dispatch({ type: "SET_MULTIPLAYER", payload: false });
        dispatch({ type: "SET_ROOM_CODE", payload: "" });
        dispatch({ type: "SET_IS_HOST", payload: false });

        whiteboard.ws = null;
        whiteboard.roomCode = "";
        whiteboard.user = null;
        whiteboard.users = [];
    }

    return (
        <main>
            {/* {window.innerWidth < 768 && (
                <Dialog open={true} onClose={() => {}} title="Mobile User" className="z-[100]">
                    <p>This page does not work on mobile.</p>
                    <Button onClick={() => window.location.href = "/"} className="w-full">Home</Button>
                </Dialog>
            )} */}

            <Dialog open={state.exportDialogOpen} onClose={() => dispatch({ type: "TOGGLE_EXPORT_DIALOG" })} title="Export" className="z-[100]">
                <Subtext>Export options</Subtext>
                <Input type="checkbox" label="Transparent Background" onChange={e => dispatch({ type: "TOGGLE_TRANSPARENT_EXPORT" })} checked={state.exportTransparent} />
                <Divider />
                {state.newCombinedSize.x !== -Infinity && <p>Resolution: {state.newCombinedSize.x} x {state.newCombinedSize.y}</p>}
                <Button onClick={exportImage} className="w-full" disabled={state.newCombinedSize.x === -Infinity}>Export</Button>
            </Dialog>

            <Dialog open={state.multiplayerDialogOpen} onClose={() => dispatch({ type: "TOGGLE_MULTIPLAYER_DIALOG" })} title="Multiplayer" className="z-[100]">
                <p>"Collaborate" with others on a whiteboard!</p>
                <Divider />
                <DiscordAuthBarrier onUserChange={user => dispatch({ type: "SET_USER", payload: user })} redirect="stuff/whiteboard" state={btoa("stuff/whiteboard")}>
                    {state.roomCode && <>
                        <p>Room Code: {state.roomCode}</p>
                        <a href="#" className="no-style text-primary"
                            onClick={() => navigator.clipboard.writeText(
                                (process.env.NEXT_PUBLIC_PRODUCTION ? "https://mrdiamond.is-a.dev/" : "http://localhost:3000/") + "stuff/whiteboard?roomCode=" + state.roomCode
                            )}
                        >Copy Link</a>
                        <Button onClick={() => leaveMultiplayer()} className="w-full" disabled={state.loading}>{state.loading ? <Spinner /> : "Leave"}</Button>
                    </>}
                    {!state.roomCode && <>
                        <Input type="text" label="Room Code" placeholder="ABCD" maxLength={4} onChange={e => dispatch({ type: "SET_ROOM_CODE_INPUT", payload: e.target.value.toUpperCase() })} value={state.roomCodeInput} />
                        <Divider />
                        <Button onClick={() => joinMultiplayer()} className="w-full" disabled={state.loading}>{state.loading ? <Spinner /> : "Join"}</Button>
                        <Button onClick={() => joinMultiplayer(true)} className="w-full my-2" disabled={state.loading}>{state.loading ? <Spinner /> : "Host"}</Button>
                        <Subtext>Your whiteboard will be cleared when you join or host a room.</Subtext>
                    </>}
                </DiscordAuthBarrier>
            </Dialog>

            <canvas ref={backgroundCanvas} width={window.innerWidth} height={window.innerHeight} className="bg-[red] absolute inset-0 -z-10" />
            <canvas ref={canvas} width={window.innerWidth} height={window.innerHeight} className="bg-transparent absolute inset-0" />

            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 flex flex-row gap-2 items-center justify-center z-20">
                <div className="bg-bg-light border border-bg-lighter rounded-r-lg p-1 flex flex-col gap-1 items-center justify-center">
                    <ToolButton icon={BiPen} onClick={() => dispatch({ type: "SET_TOOL", payload: "pen" })} selected={state.selectedTool === "pen"} />
                    <ToolButton icon={BiEraser} onClick={() => dispatch({ type: "SET_TOOL", payload: "eraser" })} selected={state.selectedTool === "eraser"} />
                    <ToolButton icon={LuShapes} onClick={() => dispatch({ type: "SET_TOOL", payload: "shape" })} selected={state.selectedTool === "shape"} />
                    <ToolbarSeparator />
                    <ToolButton icon={BiUndo} onClick={undo} />
                    <ToolButton icon={BiRedo} onClick={redo} />
                    <ToolbarSeparator />
                    <ToolButton icon={BiExport} onClick={() => dispatch({ type: "TOGGLE_EXPORT_DIALOG" })} />
                    <ToolButton icon={BiCog} onClick={() => dispatch({ type: "TOGGLE_SETTINGS" })} selected={state.settingsOpen} />
                    <ToolbarSeparator />
                    <ToolButton icon={MdOutlinePeople} onClick={() => dispatch({ type: "TOGGLE_MULTIPLAYER_DIALOG" })} selected={state.multiplayer} />
                </div>

                <div className="bg-bg-light rounded-lg p-1 flex flex-col gap-1 items-center justify-center relative">
                    {!state.settingsOpen && (
                        <ToolButton onClick={() => dispatch({ type: "TOGGLE_BRUSH_SETTINGS" })}>
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: state.brushColor }} />
                        </ToolButton>
                    )}

                    {(state.selectedTool === "shape" && !state.settingsOpen) && (<>
                        <ToolbarSeparator />
                        <ToolButton icon={TbSlash} onClick={() => dispatch({ type: "SET_SHAPE", payload: "line" })} selected={state.selectedShape === "line"} />
                        <ToolButton icon={CgArrowTopRight} onClick={() => dispatch({ type: "SET_SHAPE", payload: "arrow" })} selected={state.selectedShape === "arrow"} />
                        <ToolButton icon={LuSquare} onClick={() => dispatch({ type: "SET_SHAPE", payload: "rectangle" })} selected={state.selectedShape === "rectangle"} />
                        <ToolButton icon={FaRegCircle} onClick={() => dispatch({ type: "SET_SHAPE", payload: "circle" })} selected={state.selectedShape === "circle"} />
                        <ToolbarSeparator />
                        <ToolButton icon={PiPaintBucketBold} onClick={() => dispatch({ type: "TOGGLE_FILL" })} selected={state.shapeFill} />
                    </>)}

                    {state.settingsOpen && (<>
                        <ToolButton icon={IoMdCode} onClick={() => dispatch({ type: "TOGGLE_DEBUG" })} selected={state.debugOn} />
                        <ToolButton icon={IoMdTime} onClick={() => dispatch({ type: "TOGGLE_PROFILER" })} selected={state.profilerOn} />
                    </>)}

                    {state.brushSettingsOpen && (
                        <div className="absolute top-0 left-12 bg-bg-light border border-bg-lighter rounded-lg p-2 px-3 flex flex-col justify-center items-center">
                            <Subtext>Brush Size</Subtext>
                            <input type="range" min={1} max={100} value={state.brushSize} onChange={e => dispatch({ type: "SET_BRUSH_SIZE", payload: parseInt(e.target.value) })} />
                            <ToolbarSeparator className="my-2" />
                            <ColorSwatchTable colors={[
                                ["#ffffff", "#000000", "#FF0000", "#FF6666"],
                                ["#FF7F00", "#FFB266", "#FFFF00", "#FFFF66"],
                                ["#00FF00", "#66FF66", "#00FFFF", "#66FFFF"],
                                ["#0000FF", "#6666FF", "#8B00FF", "#B266FF"],
                                ["#FF00FF", "#FF66FF", "#FF1493", "#FF80BF"]
                            ]} onClick={color => dispatch({ type: "SET_BRUSH_COLOR", payload: color })} selected={state.brushColor} />
                            <div className="relative">
                                <div className="rounded-full border border-bg-lighter w-8 h-8 flex justify-center items-center transition-all hover:bg-bg-lighter cursor-pointer" onClick={() => dispatch({ type: "TOGGLE_COLOR_PICKER" })}>
                                    <IoColorPaletteOutline />
                                </div>

                                {state.colorPickerOpen && (
                                    <ChromePicker color={state.brushColor} onChange={color => dispatch({ type: "SET_BRUSH_COLOR", payload: color.hex })} className="absolute bottom-full left-1/2 color-picker" />
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
