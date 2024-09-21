"use client";

interface Props {
    open?: boolean;
    onClose: () => void;
    title?: string;
    children?: React.ReactNode;
    className?: string;
}

export default function Dialog(props: Props) {
    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 ${props.open ? "" : "hidden"} ${props.className ?? ""}`}>
            <div className="absolute-center bg-bg-light min-w-1/4 p-4 rounded-lg">
                <div className="flex flex-row justify-between">
                    <h2>{props.title}</h2>
                    <button onClick={props.onClose}>X</button>
                </div>
                <div>{props.children}</div>
            </div>
        </div>
    );
}
