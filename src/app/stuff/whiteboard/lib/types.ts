import { Vec2 } from "objective-canvas";

export type Tool = "pen" | "eraser" | "shape";
export type Shape = "line" | "arrow" | "rectangle" | "circle";

export type Stroke = {
    startX: number;
    startY: number;
    points: Vec2[];
    color: string;
    size: number;
    eraser?: boolean;
    owner?: string;
}

export type ShapeStroke = {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    color: string;
    size: number;
    shape: Shape;
    fill?: boolean;
    owner?: string;
}
