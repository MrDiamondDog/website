"use client";

import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import dynamic from "next/dynamic";
import { useEffect } from "react";

function Analytics({ headers }: { headers: ReadonlyHeaders }) {
    let pageViewSent = false;

    let from: string | undefined;

    for (const header of headers) {
        if (header[0] === "referer") from = header[1];
    }

    const path = window.location.pathname || "/";
    const isMobile = window.innerWidth < 768;

    useEffect(() => {
        if (pageViewSent) return;
        pageViewSent = true;

        const body = {
            type: "pageview",
            from,
            path,
            isMobile
        };

        if (window.location.hostname !== "mrdiamond.is-a.dev") {
            console.log("Did not send analytics request", body);
            return;
        }

        fetch("/api/analytics", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    }, []);

    return <div></div>;
}

export default dynamic(() => Promise.resolve(Analytics), { ssr: false });
