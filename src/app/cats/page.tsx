"use client";

import { useEffect, useState } from "react";

import Subtext from "@/components/general/Subtext";

export type Cat = {
    name: string;
    src: string;
};

export default function CatsPage() {
    const [catsList, setCatsList] = useState<Cat[]>([]);

    useEffect(() => {
        fetch("https://raw.githubusercontent.com/MrDiamondDog/website-cats/main/list.json")
            .then(res => res.json())
            .then(data => setCatsList(data));
    }, []);

    return (
        <div className="my-10 md:w-2/3 w-full md:mx-auto border border-bg-lighter p-10 rounded-lg">
            <h1>Silly cats</h1>
            <Subtext>Submit a cat <a href="/cats/submit">here</a></Subtext>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-5 mt-5">
                {catsList.map((cat: Cat) => (
                    <div key={cat.name} className="bg-bg-light rounded-lg p-5">
                        <h2>{cat.name}</h2>
                        <img src={"https://raw.githubusercontent.com/MrDiamondDog/website-cats/main/cats/" + cat.src} alt={cat.name} className="rounded-lg" />
                    </div>
                ))}
            </div>
        </div>
    );
}
