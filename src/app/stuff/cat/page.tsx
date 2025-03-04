"use client";

import { useState } from "react";
import { toast } from "sonner";

import Button from "@/components/general/Button";
import { FaCat } from "react-icons/fa6";
import Subtext from "@/components/general/Subtext";
import Confetti from "react-dom-confetti";

export default function CatPage() {
    const [cat, setCat] = useState<Blob>(null);
    const [loading, setLoading] = useState(false);

    async function getNewCat() {
        if (loading)
            return;

        setLoading(true);

        const response = await fetch("https://cataas.com/cat");

        if (!response.ok) {
            setLoading(false);
            toast.error(`Failed to fetch cat image: ${response.statusText}`);
            return;
        }

        setCat(await response.blob());

        setLoading(false);
    }

    return (<div className="absolute inset-0 bg-bg overflow-hidden">
        <div className="rounded-lg p-5 bg-bg-light absolute-center flex flex-col gap-1 items-center justify-center">
            <div className="size-[500px] bg-bg-lighter rounded-lg relative flex items-center justify-center">
                <Subtext className="absolute inset-0 flex flex-row items-center justify-center">
                    Press <FaCat className="mx-1" /> for a cat!
                </Subtext>
                {cat &&
                <img
                    src={URL.createObjectURL(cat)}
                    alt="Cat"
                    className="rounded-lg min-w-[100px] min-h-[100px] max-w-[500px] max-h-[500px] z-10"
                />}
            </div>
            <div className="z-20"><Confetti active={!loading} config={{ elementCount: 50 }} /></div>
            <Button
                onClick={getNewCat}
                disabled={loading}
                className="w-full h-[50px] text-xl enabled:hover:scale-105 enabled:active:scale-95 transition-all"
            >
                <FaCat className={loading ? "cat-spin" : "rotate-0"} />
            </Button>
        </div>
    </div>);
}
