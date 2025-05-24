import StuffItem from "@/components/home/StuffItem";

const pages = [
    {
        name: "Download RAM",
        description: "Computer slow? Running out of RAM? Just download more!",
        href: "generators/download-ram",
        tags: "tool",
    },
    {
        name: "ULTRAKILL 1-S",
        description: "Recreation of the game from ULTRAKILL 1-S",
        href: "1-s",
        tags: "game",
    },
    {
        name: "Game Of Life",
        description: "Conway's Game of Life",
        href: "game-of-life",
        tags: "game",
    },
    {
        name: "Whiteboard",
        description: "A super-simple whiteboard app.",
        href: "whiteboard",
        tags: "tool",
    },
    // {
    //     name: "Youtube Downloader",
    //     description: "Download youtube videos without being tracked and getting viruses.",
    //     href: "ytdl",
    //     tags: "tool"
    // },
    {
        name: "AI Chat",
        description: "A really terrible chatbot",
        href: "chat",
        tags: "ai",
    },
    {
        name: "Terrible Image Recognition",
        description: "A really terrible image recognition AI",
        href: "terrible-image-recognition",
        tags: "ai",
    },
    {
        name: "Jonah",
        description: "click that mf jonah",
        href: "jonah",
        tags: "random",
    },
    {
        name: "Physics Game",
        description: "A simple physics game made with Matter.js",
        href: "physics",
        tags: "game",
    },
    {
        name: "Cats",
        description: "Get free cats!",
        href: "cat",
        tags: "random",
    },
    {
        name: "Factorio Checklist",
        description: "A simple checklist app for factorio, like the mod but on a website.",
        href: "factorio-checklist",
        tags: "tool",
    },
];

export default function StuffTab() {
    return (<div className="grid grid-cols-2 gap-1 round-outside-grid">
        {pages.map((page, index) => <StuffItem
            key={index}
            title={page.name}
            description={page.description}
            href={page.href}
            tags={[page.tags]}
        />)}
    </div>);
}
