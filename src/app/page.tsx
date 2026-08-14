"use client";

import { useState } from "react";

import ContactTab from "@/components/home/ContactTab";
import ProjectTab from "@/components/home/ProjectTab";
import Divider from "@/components/primitives/Divider";
import Subtext from "@/components/primitives/Subtext";

function Tab({ active, onClick, children }: { active?: boolean, onClick?: () => void } & React.PropsWithChildren) {
	return <div className={`bg-surface0 border-b-0 border-2 ${active ? "border-primary" : "border-surface1"} rounded-t-lg text-center py-1 px-4 cursor-pointer w-full`} onClick={onClick}>
		{children}
	</div>;
}

export default function Home() {
	const [tab, setTab] = useState("home");

	return <main className="absolute-center max-w-200">
		<div className="flex gap-1">
			<Tab active={tab === "home"} onClick={() => setTab("home")}>Home</Tab>
			<Tab active={tab === "projects"} onClick={() => setTab("projects")}>Projects</Tab>
			<Tab active={tab === "contact"} onClick={() => setTab("contact")}>Contact</Tab>
		</div>
		<div className="bg-surface0 p-2 rounded-b-lg border-2 border-surface1 max-h-200 overflow-y-scroll overflow-x-hidden">
			{tab === "home" && <>
				<div className="flex gap-2 items-center">
					<img src="/img/avatar.webp" width="100" height="100" className="rounded-full size-[100px]" />
					<div className="h-full">
						<h1>Drew Rat</h1>
						<Subtext>He/Him</Subtext>
						<img src="/img/Asexual_Pride_Flag.png" width="40px" height="40px" />
					</div>
				</div>

				<Divider />

				<p>Hi! I'm from Colorado and I like building useful things on the internet!</p>
			</>}
			<ProjectTab visible={tab === "projects"} />
			<ContactTab visible={tab === "contact"} />
		</div>
	</main>;
}
