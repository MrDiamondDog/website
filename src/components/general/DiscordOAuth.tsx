"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function DiscordOAuth() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const code = searchParams.get("code");
    if (!code) return null;

    useEffect(() => {
        (async () => {
            await fetch(`/api/discord?code=${code}`, {
                method: "POST",
            });

            router.push("/");
        })();
    }, []);

    return null;
}
