import { BsBoxArrowUpRight } from "react-icons/bs";
import { FaStar } from "react-icons/fa6";
import { RxDotFilled } from "react-icons/rx";

import { getRepository } from "@/lib/github";

import Subtext from "../general/Subtext";

interface Props {
    owner: string;
    repo: string;
    highlight?: boolean;
}

export default async function ProjectCard(props: Props) {
    const { data: repo } = await getRepository(props.owner, props.repo);
    const repoLanguage = repo.language ?
        await fetch("https://raw.githubusercontent.com/ozh/github-colors/master/colors.json")
            .then(res => res.json())
            .then(json => json[repo.language]) :
        null;

    return (
        <a
            href={`https://github.com/${props.owner}/${props.repo}`}
            target="_blank"
            className={`no-style rounded-lg bg-bg-lighter p-3 pb-8 relative 
                transition-all border-[2px] hover:border-primary ${props.highlight ? "border-purple-700" : "border-transparent"}`}
        >
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-2 items-center">
                    <img src={repo.owner.avatar_url} alt={`${props.owner}'s avatar`} className="rounded-full w-6" />
                    <p>{props.owner}</p>
                </div>
            </div>
            <h3 className="font-bold">{repo.name}</h3>
            <Subtext>{repo.description}</Subtext>
            <div className="flex flex-row gap-2 items-center absolute bottom-3">
                {repoLanguage && <>
                    <div className="flex flex-row gap-1 items-center">
                        <div className="w-3 h-3 rounded-full mt-[3px]" style={{ backgroundColor: repoLanguage.color }} />
                        <p className="text-sm">{repo.language}</p>
                    </div>
                    <RxDotFilled className="text-gray-400" />
                </>}
                <div className="flex flex-row gap-1 items-center">
                    <FaStar className="text-gray-400" />
                    <p className="text-sm">{repo.stargazers_count}</p>
                </div>
            </div>
        </a>
    );
}
