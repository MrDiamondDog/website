import { initMatter } from "./matter";

export let canvas: HTMLCanvasElement;
export let ctx: CanvasRenderingContext2D;

export function initGame(_canvas: HTMLCanvasElement) {
    canvas = _canvas;
    ctx = canvas.getContext("2d")!;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    window.addEventListener("resize", () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    });

    canvas.addEventListener("contextmenu", e => e.preventDefault());

    initMatter();
}
