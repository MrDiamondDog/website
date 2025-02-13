export default function TabButton({
    children, active, onClick,
}: Readonly<{ children: React.ReactNode, active?: boolean, onClick: () => void }>) {
    return (
        <button className={`font-bold tabbutton ${active ? "active" : ""}`} onClick={onClick}>
            {children}
        </button>
    );
}
