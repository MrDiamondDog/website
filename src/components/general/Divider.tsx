export default function Divider({ className }: { className?: string }) {
    return (
        <div className={"w-full h-[3px] bg-bg-lighter my-2 rounded-lg " + (className ?? "")} />
    );
}
