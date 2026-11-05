"use client";

import { useEffect, useRef, useState } from "react";

import Subtext from "../primitives/Subtext";

export type Vec2 = { x: number, y: number };

const cellSize = 10;
const framerate = 1;

const marchingSquares: ({ from: [number, number], to: [number, number] })[][] = [
	[], // 0
	[{ from: [0, 0.5], to: [0.5, 1] }], // 1: bottom left fill
	[{ from: [0.5, 1], to: [1, 0.5] }], // 2: bottom right fill
	[{ from: [0, 0.5], to: [1, 0.5] }], // 3: bottom fill
	[{ from: [0.5, 0], to: [1, 0.5] }], // 4: top right fill
	[{ from: [0, 0.5], to: [0.5, 0] }, { from: [0.5, 1], to: [1, 0.5] }], // 5
	[{ from: [0.5, 0], to: [0.5, 1] }], // 6: right fill
	[{ from: [0, 0.5], to: [0.5, 0] }], // 7: bottom right fill
	[{ from: [0, 0.5], to: [0.5, 0] }], // 8: top left fill
	[{ from: [0.5, 0], to: [0.5, 1] }], // 9: left fill
	[{ from: [0, 0.5], to: [0.5, 1] }, { from: [0.5, 0], to: [1, 0.5] }], // 10
	[{ from: [0.5, 0], to: [1, 0.5] }], // 11: bottom left fill
	[{ from: [0, 0.5], to: [1, 0.5] }], // 12: top fill
	[{ from: [0.5, 1], to: [1, 0.5] }], // 13: top left fill
	[{ from: [0, 0.5], to: [0.5, 1] }], // 14: top right fill
	[] // 15
];

const colors = {
	bg: "#0d0e10",
	surface0: "#16191d",
	surface1: "#1b222a",
	surface2: "#2c2f37",

	primary: "#182e5c"
};

export default function CellularAutomata({ rulestring, defaultPixels }: { rulestring: string, defaultPixels?: Vec2[] }) {
	const gridRef = useRef<boolean[][]>([]);

	const [canvasW, setCanvasW] = useState(0);
	const [canvasH, setCanvasH] = useState(0);

	const width = useRef(0);
	const height = useRef(0);

	const gridW = useRef(0);
	const gridH = useRef(0);

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	function getAliveNeighbors(x: number, y: number): number {
		const { current: grid } = gridRef;

		let num = 0;

		if (grid[x + 1]?.[y])
			num++;
		if (grid[x][y + 1])
			num++;
		if (grid[x - 1]?.[y])
			num++;
		if (grid[x][y - 1])
			num++;
		if (grid[x + 1]?.[y + 1])
			num++;
		if (grid[x + 1]?.[y - 1])
			num++;
		if (grid[x - 1]?.[y + 1])
			num++;
		if (grid[x - 1]?.[y - 1])
			num++;

		return num;
	}

	function draw() {
		const { current: ctx } = ctxRef;
		const { current: grid } = gridRef;

		if (!ctx)
			return;

		ctx.clearRect(0, 0, width.current, height.current);
		ctx.fillStyle = colors.bg;
		ctx.fillRect(0, 0, width.current, height.current);

		for (let x = 0; x < gridW.current; x++) {
			for (let y = 0; y < gridH.current; y++) {
				ctx.strokeStyle = colors.surface0;
				ctx.lineWidth = 0.5;
				ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);

				if (grid[x][y]) {
					ctx.fillStyle = colors.primary;
					ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
				}
			}
		}

		drawMarching();
		simulate();
	}

	function drawMarching() {
		const marchedGrid: number[][] = [];

		const { current: ctx } = ctxRef;
		const { current: grid } = gridRef;

		if (!ctx)
			return;

		// ctx.clearRect(0, 0, width.current, height.current);

		for (let x = 0; x < gridW.current - 1; x++) {
			marchedGrid[x] = [];
			for (let y = 0; y < gridH.current - 1; y++) {
				let marchIndex = 0;

				const realGridNeighbors = [grid[x][y], grid[x][y + 1], grid[x + 1][y + 1], grid[x + 1][y]];
				const cornerValues = [8, 4, 2, 1];
				for (let i = 0; i < 4; i++)
					if (realGridNeighbors[i])
						marchIndex |= cornerValues[i];

				marchedGrid[x][y] = marchIndex;
			}
		}

		for (let x = 0; x < gridW.current - 1; x++) {
			for (let y = 0; y < gridH.current - 1; y++) {
				ctx.strokeStyle = colors.surface0;
				ctx.lineWidth = 0.5;

				const xPos = x * cellSize + cellSize / 2;
				const yPos = y * cellSize + cellSize / 2;

				// ctx.strokeRect(xPos, yPos, cellSize, cellSize);

				ctx.fillStyle = "white";
				ctx.strokeStyle = "white";
				ctx.lineWidth = 1;
				// ctx.fillText(marchedGrid[y][x] + "", y * cellSize + cellSize / 2, x * cellSize + cellSize / 2);

				const lineData = marchingSquares[marchedGrid[x][y]];
				for (const line of lineData) {
					ctx.beginPath();
					ctx.moveTo(line.from[0] * cellSize + xPos, line.from[1] * cellSize + yPos);
					ctx.lineTo(line.to[0] * cellSize + xPos, line.to[1] * cellSize + yPos);
					ctx.stroke();
				}
			}
		}

		// simulate();
	}

	function simulate() {
		const { current: grid } = gridRef;
		const newGrid = JSON.parse(JSON.stringify(grid));

		const rules = rulestring.replace(/B|S/g, "").split("/");
		const birth = [...rules[0]].map(r => parseInt(r));
		const survives = [...rules[1]].map(r => parseInt(r));

		for (let x = 0; x < gridW.current; x++) {
			for (let y = 0; y < gridH.current; y++) {
				const cell = grid[x][y];
				const neighbors = getAliveNeighbors(x, y);

				if (!cell && birth.includes(neighbors))
					newGrid[x][y] = true;
				if (cell && survives.includes(neighbors))
					newGrid[x][y] = true;
				if (cell && !birth.includes(neighbors) && !survives.includes(neighbors))
					newGrid[x][y] = false;
			}
		}

		gridRef.current = newGrid;
	}

	useEffect(() => {
		function resize() {
			const newW = document.body.clientWidth;
			const newH = document.body.clientHeight;

			width.current = newW;
			height.current = newH;

			setCanvasW(newW);
			setCanvasH(newH);

			gridW.current = Math.ceil(newW / cellSize);
			gridH.current = Math.ceil(newH / cellSize);

			let newGrid: boolean[][] = JSON.parse(JSON.stringify(gridRef.current));

			if (newGrid.length > gridW.current)
				newGrid = newGrid.slice(0, gridW.current + 1);

			for (let x = 0; x < gridW.current; x++) {
				if (!newGrid[x])
					newGrid.push([]);

				if (newGrid[x].length > gridH.current)
					newGrid[x] = newGrid[x].slice(0, gridH.current + 1);

				for (let y = 0; y < gridH.current; y++) {
					if (!newGrid[x][y])
						newGrid[x].push(Math.random() > 0.9);
				}
			}

			gridRef.current = newGrid;
		}

		resize();

		window.addEventListener("resize", resize);
		return () => window.removeEventListener("resize", resize);
	}, []);

	useEffect(() => {
	}, [gridW, gridH]);

	useEffect(() => {
		if (!canvasRef.current)
			return;

		ctxRef.current = canvasRef.current.getContext("2d");

		if (!intervalRef.current)
			intervalRef.current = setInterval(draw, 1000 / framerate);
		return () => {
			if (!intervalRef.current)
				return;
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		};
	}, []);

	return <>
		<canvas className="absolute inset-0 -z-10 overflow-hidden" width={canvasW} height={canvasH} ref={canvasRef} />
		<Subtext className="absolute bottom-1 right-1">{rulestring}</Subtext>
	</>;
}
