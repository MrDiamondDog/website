import { FaDiscord, FaGithub } from "react-icons/fa6";

import Divider from "@/components/general/Divider";
import Subtext from "@/components/general/Subtext";
import Background from "@/components/home/Background";
import ContactTab from "@/components/home/ContactTab";
import ProjectCard from "@/components/home/ProjectCard";
import Route from "@/components/home/Route";
import SendADrawing from "@/components/home/SendADrawing";
import SocialMediaProfile from "@/components/home/SocialMediaProfile";
import StackTab from "@/components/home/StackTab";
import Tab from "@/components/tabs/Tab";
import Tablist from "@/components/tabs/Tablist";

export default function Home() {
    return (<>
        <Background />
        <main
            className="absolute-center lg:w-[45%] md:w-2/3 w-full max-h-[75%] transition-[height] p-5 rounded-lg border-[3px] border-primary bg-bg-light drop-shadow-xl overflow-scroll"
        >
            <Tablist
                tabs={["Profile", "Stack", "Projects", "Stuff", "Contact"]}
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
                            <SocialMediaProfile icon={FaDiscord} copy="mrdiamonddog">@mrdiamonddog</SocialMediaProfile>
                            <SocialMediaProfile icon={FaGithub} link="https://github.com/MrDiamondDog">MrDiamondDog</SocialMediaProfile>
                        </div>
                    </div>

                    <Divider />

                    <p>
                        Hello! I'm a web/software developer, but I also dabble in other things like modding, Discord bots, microcontrollers, etc.
                        I'm also a total theatre nerd.
                    </p>

                    <Divider />

                    <SendADrawing />
                </Tab>
                <Tab name="Stack">
                    <StackTab />
                </Tab>
                <Tab name="Projects">
                    <div className="grid grid-cols-2 gap-2">
                        <ProjectCard owner="MrDiamondDog" repo="website" />
                        <ProjectCard owner="MrDiamondDog" repo="objective-canvas" />
                        <ProjectCard owner="MrDiamondDog" repo="noUglyIconsTheme" />
                        <ProjectCard owner="MrDiamondDog" repo="vencord-impersonation-reporter" />
                        <ProjectCard owner="MrDiamondDog" repo="reverse-roles-chess" />
                        <ProjectCard owner="Vendicated" repo="Vencord" />
                        <ProjectCard owner="Gabber235" repo="TypeWriter" />
                    </div>
                </Tab>
                <Tab name="Stuff" className="flex flex-col gap-2">
                    <Route route="/stuff/game-of-life">Game Of Life</Route>
                    <Route route="/stuff/whiteboard">Whiteboard</Route>
                    <Route route="/stuff/ytdl">Youtube Downloader</Route>
                    <Route route="/stuff/chat">AI Chat</Route>
                    <Route route="/stuff/terrible-image-recognition">Terrible Image Recognition</Route>
                    <Route route="/stuff/jonah">Jonah</Route>
                    <Route route="/stuff/physics">Physics Game</Route>
                </Tab>
                <Tab name="Contact">
                    <ContactTab />
                </Tab>
            </Tablist>
        </main>
    </>);
}
