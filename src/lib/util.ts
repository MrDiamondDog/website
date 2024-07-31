export interface Vec2 {
    x: number;
    y: number;
}

export const colors = {
    primary: "#3181bf",
    secondary: "#1e5178",
    tertiary: "#143b59",

    background: "#17181a",
    backgroundLight: "#1f2124",
    backgroundLighter: "#242930",
};

export function pointInside(point: Vec2, pos: Vec2, size: Vec2) {
    return point.x >= pos.x && point.x <= pos.x + size.x && point.y >= pos.y && point.y <= pos.y + size.y;
}
