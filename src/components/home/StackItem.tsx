import { IconType } from "react-icons";

interface Props {
    title: string;
    icon: IconType;
    children: React.ReactNode;
}

export default function StackItem(props: Props) {
    return (
        <div className="flex items-center gap-5">
            <props.icon size={48} color="#6b7280" className="min-w-20" />
            <div>
                <h3 className="text-lg font-semibold">{props.title}</h3>
                <p className="text-sm text-gray-500">{props.children}</p>
            </div>
        </div>
    );
}