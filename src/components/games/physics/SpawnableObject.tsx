import { Body, Vector } from "matter-js";

import { canvas } from "@/app/games/physics/lib";
import { addBody, screenMousePos, screenToWorld } from "@/app/games/physics/lib/matter";

import ToolbarButton from "./ToolbarButton";

interface Props {
    name: string;
    spawn: (pos: Vector) => Body;
}

export default function SpawnableObject(props: Props) {
    return (
        <ToolbarButton
            onMouseDown={e => {
                const body = props.spawn(screenToWorld(screenMousePos));
                addBody(body);
                // @ts-ignore
                canvas.dispatchEvent(new MouseEvent("mousedown", e));
            }}>
            {props.name}
        </ToolbarButton>
    );
}
