"use client";

import { useAptabase } from "@aptabase/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Analytics() {
    const path = usePathname();

    const { trackEvent } = useAptabase();

    const tracked = useRef(false);
    useEffect(() => {
        if (tracked.current) return;
        tracked.current = true;

        trackEvent("pageview", { path });
    }, []);

    return null;
}
