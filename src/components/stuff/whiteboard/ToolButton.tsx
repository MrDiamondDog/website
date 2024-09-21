import React, { createElement } from "react";
import { IconType } from "react-icons";

interface Props {
    icon?: IconType;
    selected?: boolean;
}

export default function ToolButton(props: React.ButtonHTMLAttributes<HTMLButtonElement> & Props) {
    return (
        <button className={"p-2 rounded-lg transition-[background-color] " + (props.selected ? "bg-bg-lighter " : "") + (props.disabled ? "text-gray-500" : "hover:bg-bg-lighter") + (props.className ?? "")} onClick={props.onClick}>
            {props.children}
            {props.icon && createElement(props.icon, { size: 24 })}
        </button>
    );
}
