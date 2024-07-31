import { IconType } from "react-icons";

interface Props {
    title: string;
    tags: string[];
    icon?: IconType;
    link?: string;
    children: React.ReactNode;
}

export default function ProjectCard(props: Props) {
    return (
        <div className="flex flex-col gap-2 w-full border-2 border-primary p-5 rounded-lg">
            <div className="flex flex-row gap-5 items-center mb-0">
                {props.icon && <props.icon size={32} />}
                <h1 className="text-clamp">{props.link ? <a href={props.link} className="text-white">{props.title}</a> : props.title}</h1>
            </div>
            <div className="flex flex-row flex-wrap gap-2">
                {props.tags.map(tag => (
                    <span className="bg-bg-lighter text-sm rounded-full px-3 py-1">{tag}</span>
                ))}
            </div>
            <p>{props.children}</p>
        </div>
    );
}
