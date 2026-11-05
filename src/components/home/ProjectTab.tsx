"use client";

import { useEffect, useState } from "react";

import Project from "./Project";

export default function ProjectTab({ visible }: { visible?: boolean }) {
	const [languageColors, setLanguageColors] = useState<Record<string, { color: string }>>();

	useEffect(() => {
		fetch("https://raw.githubusercontent.com/ozh/github-colors/master/colors.json")
			.then(res => res.json())
			.then(setLanguageColors);
	}, []);

	return <div className={`grid grid-cols-2 gap-2 ${(visible && languageColors) ? "block" : "hidden"} w-fit`}>
		<Project languageColors={languageColors} owner="MrDiamondDog" repo="Filatrack" />
		<Project languageColors={languageColors} owner="MrDiamondDog" repo="Balatrools" />
		<Project languageColors={languageColors} owner="MrDiamondDog" repo="Tungsten" />
		<Project languageColors={languageColors} owner="MrDiamondDog" repo="Neptune" />
		<Project languageColors={languageColors} owner="MrDiamondDog" repo="deltarunemusicdiscs" />
		<Project languageColors={languageColors} owner="Vendicated" repo="Vencord" />
	</div>;
}
