export default function ColorSwatch(props: { color: string, onClick?: () => void, selected?: boolean }) {
    return (
        <div
            className={`w-8 h-8 rounded-full cursor-pointer border-2 border-bg-lighter ${props.selected ? "border-primary" : ""}`}
            style={{ backgroundColor: props.color }} onClick={props.onClick}
        />
    );
}
