"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";

import Button from "@/components/general/Button";
import { FaCat } from "react-icons/fa6";
import Subtext from "@/components/general/Subtext";
import Confetti from "react-dom-confetti";
import { addCatToCollection, APICat, getCollectedCatsCount, getTotalCats } from "./lib";

export default function CatPage() {
    const [cat, setCat] = useState<APICat>(null);
    const [loading, setLoading] = useState(false);
    const [collectedCats, setCollectedCats] = useState(0);
    const [totalCatCount, setTotalCatCount] = useState(0);

    useEffect(() => {
        getTotalCats().then(setTotalCatCount);
        setCollectedCats(getCollectedCatsCount());
    }, []);

    async function getNewCat() {
        if (loading)
            return;

        setCat(null);
        setLoading(true);

        const response = await fetch("https://cataas.com/cat?json=true");

        if (!response.ok) {
            setLoading(false);
            toast.error(`Failed to fetch cat image: ${response.statusText}`);
            return;
        }

        const json = await response.json();

        setCat(json);
        addCatToCollection(json);
        setCollectedCats(getCollectedCatsCount());

        setLoading(false);
    }

    return (<div className="absolute inset-0 bg-bg overflow-hidden">
        <div className="rounded-lg p-5 bg-bg-light absolute-center flex flex-col gap-1 items-center justify-center">
            <div className="size-[500px] bg-bg-lighter rounded-lg relative flex items-center justify-center">
                <Subtext className="absolute inset-0 flex flex-row items-center justify-center">
                    {!loading && <>Press <FaCat className="mx-1" /> for a cat!</>}
                    {loading && <FaCat className={loading ? "cat-spin" : "rotate-0"} />}
                </Subtext>
                {cat &&
                <img
                    src={cat.url}
                    className="rounded-lg min-w-[100px] min-h-[100px] max-w-[500px] max-h-[500px] z-10"
                />}
            </div>
            <div className="z-20"><Confetti active={!loading} config={{ elementCount: 50 }} /></div>
            <Button
                onClick={getNewCat}
                disabled={loading}
                className="w-full h-[50px] text-xl enabled:hover:scale-105 enabled:active:scale-95 transition-all"
            >
                <FaCat />
            </Button>
            <Subtext>{(!totalCatCount) ? "..." : <>Collected {collectedCats}/{totalCatCount} cats</>}</Subtext>
        </div>
    </div>);
}
