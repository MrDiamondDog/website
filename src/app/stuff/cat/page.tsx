"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import Button from "@/components/general/Button";
import { FaCat } from "react-icons/fa6";
import Subtext from "@/components/general/Subtext";
import Confetti from "react-dom-confetti";
import { addCatToCollection, APICat, cacheAllCats, getCollectedCatsCount, getTotalCats } from "./lib";

function getAverageColor(img: HTMLImageElement) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    let width = canvas.width = img.naturalWidth;
    let height = canvas.height = img.naturalHeight;

    ctx.drawImage(img, 0, 0);

    let imageData = ctx.getImageData(0, 0, width, height);
    let data = imageData.data;
    let r = 0;
    let g = 0;
    let b = 0;

    for (let i = 0, l = data.length; i < l; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
    }

    r = Math.floor(r / (data.length / 4));
    g = Math.floor(g / (data.length / 4));
    b = Math.floor(b / (data.length / 4));

    return { r, g, b };
}

export default function CatPage() {
    const [cat, setCat] = useState<APICat>(null);
    const [loading, setLoading] = useState(false);
    const [collectedCats, setCollectedCats] = useState(0);
    const [totalCatCount, setTotalCatCount] = useState(0);
    const [avgColor, setAverageColor] = useState({ r: 0, g: 0, b: 0 });

    useEffect(() => {
        cacheAllCats();

        getTotalCats().then(setTotalCatCount);
        setCollectedCats(getCollectedCatsCount());
    }, []);

    async function getNewCat() {
        if (loading)
            return;

        setCat(null);
        setLoading(true);

        const response = await fetch("https://cataas.com/cat?json=true&type=small");

        if (!response.ok) {
            setLoading(false);
            toast.error(`Failed to fetch cat image: ${response.statusText}`);
            return;
        }

        const json = await response.json();

        setCat(json);
        addCatToCollection(json);
        setCollectedCats(getCollectedCatsCount());

        const img = new Image();
        img.onload = e => {
            setAverageColor(getAverageColor(img));
        };
        img.crossOrigin = "anonymous";
        img.src = json.url;

        setLoading(false);
    }

    return (<div className="absolute inset-0 bg-bg overflow-hidden">
        <div className="rounded-lg p-5 bg-bg-light absolute-center flex flex-col gap-1 items-center justify-center">
            <div
                className="size-[500px] bg-bg-lighter rounded-lg relative flex items-center justify-center transition-colors"
                style={{
                    backgroundColor: `rgb(${avgColor.r}, ${avgColor.g}, ${avgColor.b})`,
                }}
            >
                <Subtext className="absolute inset-0 flex flex-row items-center justify-center">
                    {(!loading && !cat) && <>Press <FaCat className="mx-1" /> for a cat!</>}
                    {(loading || cat) && <FaCat className={(loading || cat) ? "cat-spin" : "rotate-0"} />}
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
            <Subtext>{
                (!totalCatCount) ? "..." : <>
                Collected {collectedCats}/{totalCatCount} cats!
                </>
            }</Subtext>
        </div>
    </div>);
}
