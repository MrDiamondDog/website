"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

function Analytics() {
    let pageViewSent = false;
    const from = new URLSearchParams(window.location.search).get("from") ?? undefined;
    const path = window.location.pathname || "/";
    const isMobile = window.innerWidth < 768;

    useEffect(() => {
        if (pageViewSent) return;
        pageViewSent = true;

        fetch("/api/analytics", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: "pageview",
                from,
                path,
                isMobile
            }),
        });
    }, []);

    return <div></div>;
}

export default dynamic(() => Promise.resolve(Analytics), { ssr: false });
