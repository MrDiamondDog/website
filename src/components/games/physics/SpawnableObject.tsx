import { Body, Vector } from "matter-js";
import { useEffect, useState } from "react";

import { canvas } from "@/app/games/physics/lib";
import { addBody, screenMousePos, screenToWorld } from "@/app/games/physics/lib/matter";
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
    min?: number;
    max?: number;
    step?: number;
}

export default function SpawnableObject(props: SpawnableObjectProps) {
    // @ts-expect-error
    function spawn(e: MouseEvent<HTMLButtonElement, MouseEvent>, options?: Record<string, number>) {
        const body = props.spawn(screenToWorld(screenMousePos), options);
        addBody(body);
        canvas.dispatchEvent(new MouseEvent("mousedown", e));
    }

    return (<>
        {props.options ? (
            <DropdownToolbarButton title={props.name}>
                {Object.entries(props.options).map(([key, settings]) => {
                    const [value, setValue] = useState(settings.default);

                    useEffect(() => {
                        settings.default = value;
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
                    onClick={e =>
                        spawn(e, Object.fromEntries(Object.entries(props.options).map(([key, value]) => [key, value.default])))}
                >
                    Spawn
                </ToolbarButton>
            </DropdownToolbarButton>
        ) : (
            <ToolbarButton onClick={e => spawn(e)}>{props.name}</ToolbarButton>
        )}
    </>);
}
