import { createElement } from "react";

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { multiline?: boolean | "true"; label?: string }) {
    const Component = props.multiline ? "textarea" : "input";

    return (<div className="flex flex-col">
        {props.label && <label className="text-white">{props.label}{props.required && <span className="text-red-500">*</span>}</label>}
        {createElement(Component, {
            ...props,
            className: `px-4 py-2 rounded-lg ${props.className ?? ""} bg-bg-lighter border-2 border-transparent
            text-white items-center focus:outline-none focus:border-2 focus:border-primary`,
        })}
    </div>);
}
