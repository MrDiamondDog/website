import Subtext from "../general/Subtext";

export default function SupportMethod({ name, description, link, children }:
    { name: string, description: string, link: string, children: React.ReactNode }) {
    return (<div
        className="bg-bg-lighter rounded-lg border-2 border-transparent hover:border-primary
                flex flex-row justify-between items-center p-5 gap-5 transition-colors"
    >
        {children}
        <a className="flex flex-col w-full no-style" href={link}>
            <h2>{name}</h2>
            <Subtext>{description}</Subtext>
        </a>
    </div>);
}
