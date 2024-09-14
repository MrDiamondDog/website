import React from "react";
import { CgFormatSlash } from "react-icons/cg";

interface Props {
    route: string;
    children?: React.ReactNode;
}

export default function Route(props: Props) {
    return (<a href={props.route} className="no-style">
        <div className="w-full p-3 flex flex-row gap-5 bg-bg-lighter rounded-lg items-center transition-all border-[2px] border-transparent hover:border-primary">
            <CgFormatSlash size={32} />
            <h4>{props.children ?? props.route}</h4>
        </div>
    </a>);
}
