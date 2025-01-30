"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function DiscordOAuth({ setToken }: { setToken?: (token: string) => void }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    const sent = useRef(false);
    useEffect(() => {
        if (!code || sent.current)
            return;
        sent.current = true;

        (async() => {
            const res = await fetch(`/api/discord?code=${code}${state ? `&state=${state}` : ""}`, {
                method: "POST",
            });

            if (!res.ok) {
                console.error(await res.text());
                toast.error("Failed to authenticate with Discord");
            } else {
                const json = await res.json();
                setToken?.(json.access_token);
            }

            const current = new URL(window.location.href);

            current.searchParams.delete("code");
            current.searchParams.delete("state");

            router.replace(current.toString());
        })();
    }, []);

    return null;
}
