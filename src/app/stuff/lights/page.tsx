"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import Button from "@/components/general/Button";
import Divider from "@/components/general/Divider";
import Input from "@/components/general/Input";
import Subtext from "@/components/general/Subtext";

function hsvToRgb(h: number, s: number, v: number) {
    let r; let g; let b;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
    }

    return [r * 255, g * 255, b * 255];
}

export default function LightsPage() {
    const [authKey, setAuthKey] = useState<string>("");
    const [connected, setConnected] = useState(false);

    const [state, setState] = useState(false);
    const [hue, setHue] = useState(0);
    const [saturation, setSaturation] = useState(0);
    const [value, setValue] = useState(0);

    function sendRequest() {
        const query = new URLSearchParams();

        query.set("state", `${state}`);
        query.set("h", `${hue}`);
        query.set("s", `${saturation}`);
        query.set("v", `${value}`);

        fetch(`https://server.mrdiamond.is-a.dev/lights?${query.toString()}`, {
            method: "GET",
            headers: {
                Authorization: authKey,
            },
        }).catch(e => toast.error(`Failed to send request: ${e}`));
    }

    function handleMouseUp() {
        if (connected)
            sendRequest();
    }

    useEffect(() => {
        if (connected)
            sendRequest();
    }, [state]);

    return (<div className="bg-bg-light rounded-lg p-4 absolute-center">
        <h1 className="text-2xl font-bold">Lights</h1>
        <Subtext>Control the lights in my room! (Only if you have the key)</Subtext>
        <Divider />
        <div className="flex flex-col gap-2">
            {!connected && <>
                <Input placeholder="Authorization key" value={authKey} onChange={e => setAuthKey(e.target.value)} />
                <Button className="w-full" onClick={() => setConnected(true)}>Connect</Button>
            </>}
            {connected && <>
                <div className="flex justify-between items-center">
                    <Subtext>Hue:</Subtext>
                    <Input
                        type="range"
                        min={0}
                        max={360}
                        value={hue}
                        onChange={e => setHue(parseInt(e.target.value))} onMouseUp={handleMouseUp}
                    />
                </div>
                <div className="flex justify-between items-center">
                    <Subtext>Saturation:</Subtext>
                    <Input
                        type="range"
                        min={0}
                        max={1000}
                        value={saturation}
                        onChange={e => setSaturation(parseInt(e.target.value))}
                        onMouseUp={handleMouseUp}
                    />
                </div>
                <div className="flex justify-between items-center">
                    <Subtext>Value:</Subtext>
                    <Input
                        type="range"
                        min={0}
                        max={1000}
                        value={value}
                        onChange={e => setValue(parseInt(e.target.value))}
                        onMouseUp={handleMouseUp}
                    />
                </div>
                <div
                    style={{ backgroundColor: `rgb(${hsvToRgb(hue / 360, saturation / 1000, value / 1000).join(", ")})` }}
                    className="w-full h-8 rounded-lg"
                />
                <div className="flex flex-row gap-2 *:w-full">
                    <Button onClick={() => setState(false)}>Turn off</Button>
                    <Button onClick={() => setState(true)}>Turn on</Button>
                </div>
                <Button onClick={() => setConnected(false)}>Disconnect</Button>
            </>}
        </div>
    </div>);
}
