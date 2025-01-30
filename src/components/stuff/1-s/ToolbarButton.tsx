export default function ToolbarButton(props:
    React.ButtonHTMLAttributes<HTMLButtonElement> &
        { selected?: boolean; src?: string; }) {
    return (
        <button
            {...props}
            className={`${props.selected ? "!border-primary" : ""} px-2 py-2 border-2 border-transparent rounded-full 
            bg-bg-lighter w-16 h-16 flex justify-center items-center ${props.className ?? ""}`}
        >
            {props.src && <img src={props.src} className="size-10 pixelated" />}
            {!props.src && props.children}
        </button>
    );
}
