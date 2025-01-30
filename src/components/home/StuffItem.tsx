import Subtext from "../general/Subtext";

interface Props {
    title: string;
    description: string;
    href: string;
    tags?: string[];
}

const tags = {
    game: "rgb(8, 46, 72)",
    ai: "rgb(5, 61, 39)",
    tool: "rgb(77, 53, 4)",
    random: "rgb(58, 4, 55)",
};

export default function StuffItem(props: Props) {
    return (<a
        href={`/stuff/${props.href}`}
        className={`no-style bg-bg-lighter rounded-lg border-2 border-transparent 
            hover:border-primary p-3 transition-all w-full flex flex-col justify-between`}
    >
        <div>
            <h3 className="font-bold">{props.title}</h3>
            <Subtext>{props.description}</Subtext>
        </div>
        <div className="flex flex-row gap-2 mt-2">
            {props.tags?.map((tag, index) => <div
                key={index}
                className="rounded-full p-1 px-3"
                style={{ backgroundColor: tags[tag] ?? "#1f2124" }}
            >{tag}</div>)}
        </div>
    </a>);
}
