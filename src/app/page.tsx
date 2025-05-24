import { FaDiscord, FaGithub } from "react-icons/fa6";

import Divider from "@/components/general/Divider";
import Subtext from "@/components/general/Subtext";
import Background from "@/components/home/Background";
import ContactTab from "@/components/home/ContactTab";
import ProjectCard from "@/components/home/ProjectCard";
import SocialMediaProfile from "@/components/home/SocialMediaProfile";
import StackTab from "@/components/home/StackTab";
import StuffTab from "@/components/home/StuffTab";
import Tab from "@/components/tabs/Tab";
import Tablist from "@/components/tabs/Tablist";
import SupportTab from "@/components/home/SupportTab";

export default async function Home() {
    return (<>
        <Background />
        <main
            className="absolute-center lg:w-[45%] md:w-2/3 w-full max-h-[75%] transition-[width]
            p-5 rounded-lg border-[3px] border-primary bg-bg-light-transparent backdrop-blur-sm drop-shadow-xl overflow-scroll"
        >
            <Tablist
                tabs={["Profile", "Projects", "Stuff", "Stack", "Contact", "Support"]}
                activeTab="Profile"
            >
                <Tab name="Profile">
                    <div className="flex flex-col">
                        <div className="flex flex-row gap-3 items-center">
                            <img src="/images/avatar.webp" alt="Avatar" className="rounded-full w-[50px] md:w-[100px]" />
                            <div>
                                <h1 className="text-sm md:text-3xl">MrDiamondDog</h1>
                                <Subtext>He/Him</Subtext>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                            <SocialMediaProfile icon={FaDiscord} copy="mrdiamonddog">
                                @mrdiamonddog
                            </SocialMediaProfile>
                            <SocialMediaProfile icon={FaGithub} link="https://github.com/MrDiamondDog">
                                MrDiamondDog
                            </SocialMediaProfile>
                        </div>
                    </div>

                    <Divider />

                    <p className="whitespace-pre-wrap">
                        Hello! I'm a web/software developer, but I also dabble in other things
                        like modding, Discord bots, microcontrollers, etc.
                        I'm also a total theatre nerd.{"\n"}{"\n"}

                        I'm currently working on{" "}
                        <a href="https://balatrools.pages.dev" className="text-primary">Balatrools</a>,
                        a collection of tools & resources for Balatro!{"\n"}{"\n"}

                        If you would like to support my work, please visit my{" "}
                        <a href="/support" className="text-primary">Support</a> page!
                    </p>
                </Tab>
                <Tab name="Stack">
                    <StackTab />
                </Tab>
                <Tab name="Projects">
                    <div className="grid grid-cols-2 gap-1 round-outside-grid">
                        <ProjectCard owner="MrDiamondDog" repo="website" highlight />
                        <ProjectCard owner="MrDiamondDog" repo="balatrools" highlight />
                        <ProjectCard owner="MrDiamondDog" repo="v1-bot" />
                        <ProjectCard owner="MrDiamondDog" repo="objective-canvas" />
                        <ProjectCard owner="MrDiamondDog" repo="elegoo-keyboard" />
                        <ProjectCard owner="MrDiamondDog" repo="noUglyIconsTheme" />
                        <ProjectCard owner="MrDiamondDog" repo="vencord-impersonation-reporter" />
                        <ProjectCard owner="MrDiamondDog" repo="reverse-roles-chess" />
                        <ProjectCard owner="Vendicated" repo="Vencord" />
                        <ProjectCard owner="Gabber235" repo="TypeWriter" />
                    </div>
                </Tab>
                <Tab name="Stuff" className="flex flex-col gap-2">
                    <StuffTab />
                </Tab>
                <Tab name="Contact">
                    <ContactTab />
                </Tab>
                <Tab name="Support">
                    <SupportTab />
                </Tab>
            </Tablist>

            <Divider />
            <Subtext>
                Source code available on{" "}
                <a href="https://github.com/mrdiamonddog/website" className="no-style text-primary">GitHub</a>.
            </Subtext>
        </main>
    </>);
}
