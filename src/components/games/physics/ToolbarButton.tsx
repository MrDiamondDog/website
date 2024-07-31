export default function ToolbarButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button {...props} className={"px-4 py-2 rounded-full bg-bg-lighter " + (props.className ?? "")}>
            {props.children}
        </button>
    );
}
