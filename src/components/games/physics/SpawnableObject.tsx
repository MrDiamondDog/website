import { Body, Vector } from "matter-js";
import { useEffect, useState } from "react";

import { canvas } from "@/app/stuff/physics/lib";
import { addBody, screenMousePos, screenToWorld } from "@/app/stuff/physics/lib/matter";
import Input from "@/components/general/Input";

import DropdownToolbarButton from "./DropdownToolbarButton";
import ToolbarButton from "./ToolbarButton";

export interface SpawnableObjectProps {
    name: string;
    spawn: (pos: Vector, settings?: Record<string, number>) => Body;
    options?: Record<string, SpawnableObjectOption>;
}

interface SpawnableObjectOption {
    default: number;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
}

export default function SpawnableObject(props: SpawnableObjectProps) {
    function spawn(e: any, options?: Record<string, number>) {
        const body = props.spawn(screenToWorld(screenMousePos), options);
        addBody(body);
        canvas.dispatchEvent(new MouseEvent("mousedown", e));
    }

    return (<>
        {props.options ? (
            <DropdownToolbarButton
                title={props.name}
            >
                {Object.entries(props.options).map(([key, settings]) => {
                    if (!settings.value) settings.value = settings.default;
                    const [value, setValue] = useState(settings.value);

                    useEffect(() => {
                        settings.value = value;
                    }, [value]);

                    return <Input
                        key={key}
                        type="range"
                        min={settings.min ?? 0}
                        max={settings.max ?? 100}
                        step={settings.step ?? 1}
                        label={`${key} (${value})`}
                        value={value}
                        onChange={e => setValue(parseInt(e.target.value))}
                    />;
                })}
                <ToolbarButton
                    onMouseDown={e =>
                        spawn(e, Object.fromEntries(Object.entries(props.options).map(([key, option]) => [key, option.value])))}
                >
                    Spawn
                </ToolbarButton>
            </DropdownToolbarButton>
        ) : (
            <ToolbarButton onMouseDown={e => spawn(e)}>{props.name}</ToolbarButton>
        )}
    </>);
}
