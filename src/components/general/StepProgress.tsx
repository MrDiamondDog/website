
export default function StepProgress({ progress, maxProgress }: { progress: number; maxProgress: number }) {
    return (
        <div className="flex flex-row gap-1 items-center w-full mb-2 *:transition-all">
            {new Array(maxProgress).fill(0)
                .map((_, i) => <div
                    key={i}
                    className="w-full rounded-full h-[5px]"
                    style={{ backgroundColor: progress >= i + 1 ? "var(--primary)" : "var(--background-lightest)" }}
                />)}
        </div>
    );
}
