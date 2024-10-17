import { Vec2 } from "objective-canvas";

import { Level } from ".";

export const levels: Level[] = [
    {
        gridSize: Vec2.from(3, 1),
        grid: [
            [
                { color: "white", type: "start" }
            ],
            [
                null
            ],
            [
                { color: "white", type: "end" }
            ]
        ]
    }
];
