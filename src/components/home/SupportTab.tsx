import { FaGithub } from "react-icons/fa6";
import Divider from "../general/Divider";
import Subtext from "../general/Subtext";
import SupportMethod from "./SupportMethod";
import { Coffee } from "lucide-react";

export default function SupportTab() {
    return <>
        <Subtext>Here's all the ways you can support me and my work. Any support at all is appreciated!</Subtext>
        <Divider />

        <div className="flex flex-col gap-2">
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
    </>;
}
