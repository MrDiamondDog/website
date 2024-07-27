export default function Subtext({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <p className="text-sm text-gray-400">
            {children}
        </p>
    );
}
