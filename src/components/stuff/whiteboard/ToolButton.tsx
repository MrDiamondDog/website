import React, { createElement } from "react";
import { IconType } from "react-icons";

interface Props {
    icon?: IconType;
    selected?: boolean;
}

export default function ToolButton(props: React.ButtonHTMLAttributes<HTMLButtonElement> & Props) {
    return (
        <button className={"border border-bg-lighter p-2 hover:bg-bg-lighter rounded-lg transition-[background-color] " + (props.selected ? "bg-bg-lighter " : "") + (props.className ?? "")} onClick={props.onClick}>
            {props.children}
            {props.icon && createElement(props.icon, { size: 24 })}
        </button>
    );
}
