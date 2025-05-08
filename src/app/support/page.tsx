import Divider from "@/components/general/Divider";
import Subtext from "@/components/general/Subtext";
import Background from "@/components/home/Background";
import SupportMethod from "@/components/home/SupportMethod";
import { FaCoffee } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";

export default async function Home() {
    return (<>
        <Background />
        <main
            className="absolute-center lg:w-[45%] md:w-2/3 w-full max-h-[75%] transition-[width]
            p-5 rounded-lg border-[3px] border-primary bg-bg-light-transparent backdrop-blur-sm drop-shadow-xl overflow-scroll"
        >
            <h1>Support My Work</h1>
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
                    <FaCoffee size={64} />
                </SupportMethod>
            </div>
        </main>
    </>);
}
