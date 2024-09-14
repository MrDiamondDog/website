"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function DiscordOAuth() {
    const searchParams = useSearchParams();

    const code = searchParams.get("code");
    if (!code) return null;

    useEffect(() => {
        (async () => {
            await fetch(`/api/discord?code=${code}`, {
                method: "POST",
            });
        })();
    }, []);

    return null;
}
