"use client";

import { useEffect, useRef,useState } from "react";

import Spinner from "@/components/general/Spinner";
import { getNewState, keyboard, State, uppercaseKeyboard } from "@/lib/words";

const wsUrl = process.env.NEXT_PUBLIC_PRODUCTION
    ? "wss://server.mrdiamond.is-a.dev"
    : "ws://localhost:8080";

export default function WordsPage() {
    const [state, setState] = useState<State>({
        content: "loading...",
        shift: false,
        capsLock: false,
    });
    const [loading, setLoading] = useState("loading");
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [wsReady, setWsReady] = useState(false);

    const ws = useRef<WebSocket | null>(null);
    const timeInterval = useRef<NodeJS.Timeout | null>(null);

    function onClickButton(key: string, rawKey: string) {
        setState(getNewState(state, key));
        setLoading(rawKey);
        sendKey(rawKey);
        setTimeRemaining(10);
    }

    async function sendKey(key: string) {
        if (ws.current?.readyState !== WebSocket.OPEN)
            return;

        ws.current.send(JSON.stringify({ type: "key", key }));
        setLoading("");

        let time = 10;
        if (timeInterval.current) return;

        timeInterval.current = setInterval(() => {
            time--;
            setTimeRemaining(time);

            if (time <= 0 && timeInterval.current) {
                clearInterval(timeInterval.current);
                setTimeRemaining(0);
                timeInterval.current = null;
            }
        }, 1000);
    }

    useEffect(() => {
        ws.current = new WebSocket(wsUrl);

        ws.current.addEventListener("open", () => {
            setWsReady(true);
            setLoading("");
        });

        ws.current.addEventListener("message", event => {
            const data = JSON.parse(event.data);

            console.log(data);

            if (data.type === "state") {
                setState(data.state);
            }
        });

        ws.current.addEventListener("close", () => {
            setWsReady(false);
        });

        ws.current.addEventListener("error", err => {
            console.error("WebSocket error:", err);
        });

        return () => {
            ws.current?.close();
            if (timeInterval.current) {
                clearInterval(timeInterval.current);
            }
        };
    }, []);

    return (
        <main className="absolute-center bg-bg-light rounded-lg p-10">
            <div className="p-2 bg-bg border-[2px] border-primary rounded-lg whitespace-pre-wrap overflow-y-scroll max-h-[500px]">
                {state.content || " "}
            </div>

            {state.capsLock && <div className="mt-2 text-center">Caps Lock</div>}
            <div className="flex flex-col w-full bg-bg rounded-lg gap-2 mt-2 p-3">
                {(state.shift ? uppercaseKeyboard : keyboard).map((row, i) => (
                    <div key={i} className="w-full flex flex-row gap-2">
                        {row.map((key, j) => (
                            <button
                                key={j}
                                className="p-2 px-1 md:px-4 border-[2px] border-transparent hover:border-primary disabled:border-transparent disabled:text-gray-500 transition-all bg-bg-light text-white rounded-lg w-full text-nowrap whitespace-pre-wrap"
                                onClick={() => onClickButton(key.trim().toLowerCase(), key)}
                                disabled={!wsReady || loading !== "" || timeRemaining > 0}
                            >
                                {loading === key ? <Spinner /> : key}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
            {timeRemaining > 0 && <div className="mt-2 text-center">{timeRemaining}s</div>}
        </main>
    );
}
