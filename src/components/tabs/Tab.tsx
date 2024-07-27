export default function Tab({ children, name }: Readonly<{ children: React.ReactNode, name: string }>) {
    return (
        <div data-tab={name}>
            {children}
        </div>
    );
}