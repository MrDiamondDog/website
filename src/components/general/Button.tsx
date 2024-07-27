import React from "react";

export default function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={`px-4 py-2 rounded-lg ${props.className} bg-primary hover:bg-secondary text-white items-center`}
        />
    );
}