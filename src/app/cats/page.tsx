"use client";

import { useEffect, useState } from "react";

import Subtext from "@/components/general/Subtext";

type Cat = {
    name: string;
    src: string;
    from?: string;
};

export default function CatsPage() {
    const [catsList, setCatsList] = useState<Cat[]>([]);

    useEffect(() => {
        fetch("https://raw.githubusercontent.com/MrDiamondDog/website-cats/main/list.json")
            .then(res => res.json())
            .then(data => setCatsList(data));
    }, []);

    return (
        <div className="my-10 w-2/3 mx-auto border border-bg-lighter p-10 rounded-lg">
            <h1>Silly cats</h1>
            <Subtext>Submit a cat <a href="https://github.com/MrDiamondDog/website-cats" target="_blank">here</a></Subtext>
            <div className="grid grid-cols-2 gap-5">
                {catsList.map((cat: Cat) => (
                    <div key={cat.name} className="bg-bg-light rounded-lg p-5">
                        <h2>{cat.name}</h2>
                        {cat.from && <Subtext className="mb-2">From: {cat.from}</Subtext>}
                        <img src={"https://raw.githubusercontent.com/MrDiamondDog/website-cats/main/cats/" + cat.src} alt={cat.name} className="rounded-lg" />
                    </div>
                ))}
            </div>
        </div>
    );
}
