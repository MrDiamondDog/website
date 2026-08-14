"use client";

import { Dot, Star } from "lucide-react";
import { useEffect, useState } from "react";

import { getRepository } from "@/actions/github";
import { numberWithCommas } from "@/lib/util";

import Subtext from "../primitives/Subtext";

interface Props {
    owner: string;
    repo: string;
    languageColors?: Record<string, { color: string }>
}

export default function Project(props: Props) {
	const [repo, setRepo] = useState<{
		language: string | null,
		name: string,
		description: string | null,
		stargazers_count: number,
		owner: { avatar_url: string };
	}>();

	const [repoColor, setRepoColor] = useState("");

	useEffect(() => {
		getRepository(props.owner, props.repo).then(res => setRepo(res.data));
	}, [props.repo, props.owner]);

	useEffect(() => {
		if (!repo || !props.languageColors)
			return;
		setRepoColor(repo.language ? props.languageColors[repo.language].color : "");
	}, [repo, props.languageColors]);

    return (
        <a
            href={`https://github.com/${props.owner}/${props.repo}`}
            target="_blank"
            className={`rounded-lg bg-surface1 p-3 flex flex-col w-full
                transition-all border-2 hover:border-primary border-surface2`} rel="noreferrer"
        >
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-2 items-center">
					{repo?.owner.avatar_url && <img src={repo.owner.avatar_url} alt={`${props.owner}'s avatar`} className="rounded-full w-6" />}
                    <p>{props.owner}</p>
                </div>
            </div>
            <h3 className="font-bold">{props.repo}</h3>
            <Subtext>{repo?.description}</Subtext>
            <div className="flex flex-row items-center mt-auto">
                {(repoColor && repo?.language) && <>
                    <div className="flex flex-row gap-1 items-center">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: repoColor }} />
                        <p className="text-sm">{repo?.language}</p>
                    </div>
                </>}
				{repoColor && repo?.stargazers_count !== undefined && <Dot className="text-gray-400" />}
				{repo?.stargazers_count !== undefined && <div className="flex flex-row gap-1 items-center">
					<Star className="text-gray-400" size={18} />
					<p className="text-sm">{numberWithCommas(repo.stargazers_count)}</p>
				</div>}
            </div>
        </a>
    );
}
