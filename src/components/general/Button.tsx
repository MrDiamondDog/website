import React from "react";

export enum ButtonStyles {
    primary = "bg-primary hover:bg-secondary text-white",
    secondary = "bg-bg-lighter hover:bg-bg-lightest text-white",
    danger = "bg-red-500 hover:bg-red-600 text-white",
}

export default function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { look?: ButtonStyles }) {
    return (
        <button
            {...props}
            className={`px-4 py-2 rounded-lg ${props.className} ${props.look ?? ButtonStyles.primary} 
            transition-all flex justify-center items-center disabled:bg-secondary`}
        />
    );
}
