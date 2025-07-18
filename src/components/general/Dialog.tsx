"use client";

import { X } from "lucide-react";

interface Props {
    open?: boolean;
    onClose: () => void;
    title?: string;
    children?: React.ReactNode;
    className?: string;
}

export default function Dialog(props: Props) {
    return (
        <div className={`z-20 fixed inset-0 bg-black bg-opacity-75 ${props.open ? "" : "hidden"} ${props.className ?? ""}`}>
            <div className="absolute-center bg-bg-light min-w-[500px] p-4 rounded-lg">
                <div className="flex flex-row justify-between items-center gap-5">
                    <h2>{props.title}</h2>
                    <button
                        onClick={props.onClose}
                        className="size-8 flex items-center justify-center rounded-lg hover:bg-bg-lighter transition-all"
                    >
                        <X />
                    </button>
                </div>
                <div>{props.children}</div>
            </div>
        </div>
    );
}
