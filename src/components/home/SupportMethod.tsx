import Subtext from "../primitives/Subtext";

export default function SupportMethod({ name, description, link, children }:
    { name: string, description: string, link: string, children: React.ReactNode }) {
    return (<a
        className="bg-surface1 rounded-lg border-2 border-transparent hover:border-primary
                flex flex-row justify-between items-center p-5 gap-5 transition-colors"
		href={link}
        target="_blank"
    >
        {children}
        <div className="flex flex-col w-full no-style">
            <h2>{name}</h2>
            <Subtext>{description}</Subtext>
        </div>
    </a>);
}
