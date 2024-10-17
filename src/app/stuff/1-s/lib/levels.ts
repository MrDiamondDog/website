import { Vec2 } from "objective-canvas";

import { Level } from ".";

export const levels: Level[] = [
    {
        gridSize: Vec2.from(3, 3),
        grid: [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ]
    }
];


export function exportLevel(level: Level) {
    for (let y = 0; y < level.gridSize.y; y++) {
        for (let x = 0; x < level.gridSize.x; x++) {
            const square = level.grid[x][y];
            if (!square) continue;

            delete square.pos;
            delete square.linePoints;
        }
    }

    return btoa(JSON.stringify(level));
}
