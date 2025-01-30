"use client";

import { useState } from "react";
import { toast } from "sonner";

import Button from "@/components/general/Button";
import Spinner from "@/components/general/Spinner";

export default function CatPage() {
    const [cat, setCat] = useState<Blob>(null);
    const [loading, setLoading] = useState(false);

    async function getNewCat() {
        if (loading)
            return;

        setCat(null);
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

    return (
        <div className="rounded-lg p-5 bg-bg-light absolute-center">
            <Button onClick={getNewCat} className="w-full mb-3" disabled={loading}>Cat</Button>
            {loading && <Spinner />}
            {cat && <img src={URL.createObjectURL(cat)} alt="Cat" className="rounded-lg max-w-[500px]" />}
        </div>
    );
}
