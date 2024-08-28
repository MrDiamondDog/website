"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

function Analytics() {
    let pageViewSent = false;
    const referrer = document.referrer ?? undefined;

    const path = window.location.pathname || "/";
    const isMobile = window.innerWidth < 768;

    useEffect(() => {
        if (pageViewSent) return;
        pageViewSent = true;

        const body = {
            type: "pageview",
            from: referrer,
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
