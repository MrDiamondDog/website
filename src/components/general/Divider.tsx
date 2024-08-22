export default function Divider({ className }: { className?: string }) {
    return (
        <div className={"w-full h-[3px] bg-primary my-5 rounded-lg " + (className ?? "")} />
    );
}
