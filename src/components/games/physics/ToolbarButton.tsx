export default function ToolbarButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <div className="px-4 py-2 rounded-full bg-bg-lighter">
            <button {...props}>
                {props.children}
            </button>
        </div>
    );
}
