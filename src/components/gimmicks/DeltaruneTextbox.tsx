"use client";

import { useEffect, useRef, useState } from "react";

import Portal from "../primitives/Portal";

export type Choicer = { options: [string, string], responses: (i: number) => Dialogue };

export type Dialogue = (
	string |
	(() => string) |
	Choicer
)[];

function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function SOUL() {
	return <img src="/img/SOUL.png" width="30" height="30" className="w-7.5 h-7.5" alt="SOUL" />;
}

const dialogueSpeed = 1 / 30;
const pauseLength = 2 / 30;

export default function DeltaruneTextbox({ dialogue: initialDialogue, onFinish }: { dialogue: Dialogue, onFinish?: () => void }) {
	const [dialogue, setDialogue] = useState(initialDialogue);
	const [dialogueIndex, setDialogueIndex] = useState(0);
	const [textIndex, setTextIndex] = useState(0);
	const [currentText, setCurrentText] = useState("");
	const [option, setOption] = useState(-1);
	const playing = useRef(false);

	const isChoicer = typeof dialogue[dialogueIndex] === "object";
	const choicer = isChoicer ? dialogue[dialogueIndex] as Choicer : undefined;

	function next() {
		if (playing.current || isChoicer)
			return;

		if (dialogueIndex === dialogue.length - 1) {
			onFinish?.();
			return;
		}

		setDialogueIndex(i => i + 1);
		setTextIndex(0);
	}

	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (e.key === "z")
				next();
		}

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [isChoicer, dialogueIndex, dialogue]);

	useEffect(() => {
		if (!isChoicer)
			return;

		function onKeyDown(e: KeyboardEvent) {
			if (e.key === "ArrowLeft")
				setOption(0);
			if (e.key === "ArrowRight")
				setOption(1);

			if (e.key === "z" && option !== -1) {
				setDialogue(choicer!.responses(option));
				setDialogueIndex(0);
				setTextIndex(0);
				setOption(-1);
				setCurrentText("");
			}
		}

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [isChoicer, option]);

	useEffect(() => {
		let text = "";
		if (!isChoicer)
			if (typeof dialogue[dialogueIndex] === "function")
				text = dialogue[dialogueIndex]();
			else
				text = dialogue[dialogueIndex] as string;

		setCurrentText(text);

		if (isChoicer || playing.current)
			return;

		setTextIndex(0);
		let i = 0;
		(async () => {
			playing.current = true;

			while (i <= text.length) {
				await sleep(dialogueSpeed * 1000);
				i++;
				setTextIndex(i);

				if (text[i] === "^") {
					const pause = parseInt(text[i + 1]);
					console.log("pause", pause);
					text = text.replace(`^${pause}`, "");
					setCurrentText(text);
					await sleep(pauseLength * pause * 1000);
					continue;
				}

				if (text[i] !== " ")
					new Audio("/snd/snd_text.wav").play();
			}

			playing.current = false;
		})();
	}, [dialogueIndex]);

	return <Portal>
		<div className="absolute inset-0 z-10" onClick={next} />
		<div className="absolute bottom-10 left-1/2 -translate-x-1/2 font-[Determination_Mono] pixelated w-250 select-none">
			<img src="/img/text-box.png" width="100%" alt="" />
			<div className="absolute inset-0 w-full h-full px-[5%] py-[4%] text-[200%]">
				{!isChoicer && <p>{currentText.slice(0, textIndex)}</p>}
				{(isChoicer && choicer) && <div className="flex justify-between items-center h-full">
					<div className="flex w-full items-center">
						{option === 0 && <SOUL />}
						<p className={option === 0 ? "text-[yellow]" : "pl-7.5"}>{choicer.options[0]}</p>
					</div>
					{option === -1 && <SOUL />}
					<div className="flex w-full justify-end items-center">
						{option === 1 && <SOUL />}
						<p className={option === 1 ? "text-[yellow]" : "pl-7.5"}>{choicer.options[1]}</p>
					</div>
				</div>}
			</div>
		</div>
	</Portal>;
}
