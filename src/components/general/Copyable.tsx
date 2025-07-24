"use client";

import { useState } from "react";

export default function Copyable({
    text,
    className,
    children,
}: Readonly<{ text: string; className: string, children: React.ReactNode }>) {
    const [copyOpen, setCopyOpen] = useState(false);

    return (
        <div
            className={`${className} relative`}
        >
            <a
                href="#"
                onClick={() => {
                    navigator.clipboard.writeText(text);
                    setCopyOpen(true);
                    setTimeout(() => setCopyOpen(false), 1000);
                }}
            >
                {children}
            </a>

            <div
                className="absolute top-[-5px] left-[-7px] right-[-7px] bottom-[-5px] bg-primary rounded-lg px-2
                transition-opacity text-white pointer-events-none select-none"
                style={{ opacity: copyOpen ? 90 : 0 }}
            >
                <p className="absolute-center">Copied!</p>
            </div>
        </div>
    );
}
