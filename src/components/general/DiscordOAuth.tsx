"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function DiscordOAuth() {
    const searchParams = useSearchParams();

    const code = searchParams.get("code");
    if (!code) return null;

    const state = searchParams.get("state");

    const sent = useRef(false);
    useEffect(() => {
        if (sent.current) return;
        sent.current = true;

        (async () => {
            await fetch(`/api/discord?code=${code}${state ? `&state=${state}` : ""}`, {
                method: "POST",
            });
        })();
    }, []);

    return null;
}
