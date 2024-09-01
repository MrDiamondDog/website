import { IconType } from "react-icons";

import Copyable from "../general/Copyable";

export default function SocialMediaProfile(props: Readonly<{
  icon: IconType;
  children: React.ReactNode;
  link?: string;
  copy?: string;
}>) {
    return (
        <div className="flex flex-row gap-3 items-center">
            <props.icon size={32} aria-label="Icon" />
            <div>
                {props.link && <a href={props.link} className="text-sm md:text-lg">{props.children}</a>}
                {props.copy && <Copyable text={props.copy} className="text-sm md:text-lg">{props.children}</Copyable>}
                {!props.link && !props.copy && <p className="text-sm md:text-lg">{props.children}</p>}
            </div>
        </div>
    );
}
