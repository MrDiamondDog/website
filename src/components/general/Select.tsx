import React from "react";

export default function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select {...props} className={`px-4 py-2 rounded-lg bg-bg-lighter border border-bg-lighter ${props.className ?? ""}`}>
            {props.children}
        </select>
    );
}
