import { Coffee } from "lucide-react";
import { FaGithub } from "react-icons/fa6";

import Divider from "../primitives/Divider";
import SupportMethod from "./SupportMethod";

export default function SupportTab({ visible }: { visible: boolean }) {
    return <div className={`${visible ? "block" : "hidden"} w-full`}>
        <p>Here's all the ways you can support me and my work. Any support at all is appreciated!</p>
        <Divider />

        <div className="grid gap-2 grid-cols-2">
            <SupportMethod
                name="GitHub Sponsors"
                description="Sponsoring my work on GitHub will get you special perks!"
                link={"https://github.com/sponsors/MrDiamondDog"}
            >
                <FaGithub size={64} />
            </SupportMethod>
            <SupportMethod
                name="Buy Me a Coffee!"
                description="The most simple way to support me. Any amount is appreciated!"
                link={"https://buymeacoffee.com/zoy33nftqp"}
            >
                <Coffee size={64} />
            </SupportMethod>
        </div>
    </div>;
}
