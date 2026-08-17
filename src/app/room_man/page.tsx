"use client";

import { useState } from "react";

import DeltaruneTextbox from "@/components/gimmicks/DeltaruneTextbox";

export default function Room_man() {
	const [dialoguePlaying, setDialoguePlaying] = useState(false);

	return <main onClick={() => !dialoguePlaying && setDialoguePlaying(true)} className="h-screen">
		{dialoguePlaying && <DeltaruneTextbox
			dialogue={[
				"* (Well,^1 there is a man here.)",
				"* (He offers you something.)",
				{
					options: ["Yes", "No"],
					responses: i =>
						i === 0 ? [
							() => {
								new Audio("/snd/snd_egg.wav").play();
								return "* (You received the \"Egg\".)";
							},
							{
								options: ["Ask for more", "Do not"],
								responses: i => [
									"* (Well,^1 the man put his hand softly on your shoulder.)",
									"* (And, showing you his empty palm...)",
									(i === 0 ?
										"* (He put his finger to his mouth,^1 smiled,^1 and shook his head.)" :
										"* (He put his finger to his mouth,^1 smiled,^1 and nodded his head.)"
									),
									"* (It seems you have everything.)",
									"* (...)",
									"* (He waved goodbye,^1 looking away slightly after a moment.)",
									"* (...)",
									"* (Kris felt a strange melancholy.)",
									"* (It was a feeling that they should not look for the man anymore.)",
									"* (...^1 even though they had never done such a thing in the first place.)"
								]
							}
						] : [
							"* (Well,^1 there is not a man here.)"
						]
				}
			]}
			onFinish={() => setDialoguePlaying(false)}
		/>}
	</main>;
}
