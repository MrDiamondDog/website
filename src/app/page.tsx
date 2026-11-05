"use client";

import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";

import CellularAutomata from "@/components/gimmicks/CellularAutomata";
import ContactTab from "@/components/home/ContactTab";
import ProjectTab from "@/components/home/ProjectTab";
import Button from "@/components/primitives/Button";
import Divider from "@/components/primitives/Divider";
import Subtext from "@/components/primitives/Subtext";
import { AnimateSize } from "@/components/utils/AnimateSize";

function Tab({ active, onClick, children }: { active?: boolean, onClick?: () => void } & React.PropsWithChildren) {
	return <div className={`bg-surface0 border-t-2 border-surface1 border-2 ${active ? "border-b-primary" : "border-b-surface1"} rounded-lg	text-center py-1 px-4 cursor-pointer w-full`}
		onClick={onClick}>
		{children}
	</div>;
}

export default function Home() {
	const [tab, setTab] = useState("home");

	const tabSwitches = useRef(0);
	const router = useRouter();

	useEffect(() => {
		tabSwitches.current++;

		if (tabSwitches.current > 20 && Math.floor(Math.random() * 50) === 0)
			router.push("/room_man");
	}, [tab]);

	return <>
		<div className="opacity-30">
			<CellularAutomata rulestring="B3/S23" />
		</div>
		<AnimateSize className="absolute-center w-fit" lockWidth={true}>
			<div className="flex mb-2 gap-2">
				<Tab active={tab === "home"} onClick={() => setTab("home")}>Home</Tab>
				<Tab active={tab === "projects"} onClick={() => setTab("projects")}>Projects</Tab>
				<Tab active={tab === "contact"} onClick={() => setTab("contact")}>Contact</Tab>
			</div>
			<div className="bg-surface0 p-2 rounded-lg border-2 border-surface1 overflow-y-scroll overflow-x-hidden drop-shadow-lg w-fit">
				{tab === "home" && <div className="w-200">
					<div className="flex gap-2 items-center">
						<img src="/img/avatar.png" width="100" height="100" className="rounded-full size-25" alt="My Avatar" />
						<div className="h-full">
							<h1>Drew</h1>
							<Subtext>He/Him</Subtext>
							<img src="/img/Asexual_Pride_Flag.png" width="40px" height="40px" alt="Asexual Pride Flag" />
						</div>
					</div>

					<Divider />

					<p>Hi! I'm a computer science major from Colorado and I like building useful things on the internet!</p>
					<p>I make projects mainly for myself, but some projects I decide to host and allow other people to use.</p>
					<p>Most of my projects are web apps in Next.JS + Typescript, but I also have experience with Java, C++, Python, and a couple others!</p>
					<p>All of my projects are made without AI. I enjoy programming and not destroying the environment!</p>
					<p>I've also contributed to a couple open-source projects.</p>
					<p>If you have any questions or comments, please use the Contact page or email me!</p>

					<Divider />

					<div className="flex gap-2 mt-2 *:w-full">
						<a href={`mailto:${atob("ZHJld0BkcmV3cmF0LmRldg==")}`} target="_blank"><Button><Mail size={18} /> Email</Button></a>
						<a href="https://discord.gg/rVp5BR8K96" target="_blank"><Button><FaDiscord size={18} /> Discord</Button></a>
						<a href="https://github.com/mrdiamonddog" target="_blank"><Button><FaGithub size={18} /> GitHub</Button></a>
					</div>
				</div>}
				<ProjectTab visible={tab === "projects"} />
				<ContactTab visible={tab === "contact"} />
			</div>
		</AnimateSize>
	</>;
}
