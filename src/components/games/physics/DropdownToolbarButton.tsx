"use client";

import { useState } from "react";
import { MdArrowDropDown } from "react-icons/md";

import ToolbarButton from "./ToolbarButton";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    title: string;
    onClose?: () => void;
}

export default function DropdownToolbarButton(props: Props) {
    const [open, setOpen] = useState(false);

    return (<>
        <div className={"relative " + (props.className ?? "")}>
            <ToolbarButton onClick={() => {
                setOpen(!open);
                if (!open && props.onClose) props.onClose();
            }} className="flex flex-row items-center pr-3" >
                {props.title} <MdArrowDropDown size={24} className={open ? "rotate-180" : "rotate-0"} />
            </ToolbarButton>

            {open && (
                <div className="absolute top-12 left-0 flex flex-col gap-1 p-4 bg-bg-light-transparent rounded-lg backdrop-blur-md">
                    {props.children}
                </div>
            )}
        </div>
    </>);
}
