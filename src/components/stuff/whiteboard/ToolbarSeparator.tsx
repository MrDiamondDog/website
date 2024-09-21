export default function ToolbarSeparator(props: { className?: string }) {
    return (
        <div className={"w-full border border-bg-lighter " + (props.className ?? "")} />
    );
}
