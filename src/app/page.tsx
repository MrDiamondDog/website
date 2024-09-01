import { DiJava } from "react-icons/di";
import { FaDiscord, FaGithub } from "react-icons/fa6";
import { SiCplusplus, SiCsharp, SiIntellijidea, SiKotlin, SiNextdotjs, SiNodedotjs, SiOracle, SiPostgresql, SiPrisma, SiRider, SiTailwindcss, SiTypescript, SiUnity, SiVercel, SiVisualstudiocode } from "react-icons/si";

import Divider from "@/components/general/Divider";
import Subtext from "@/components/general/Subtext";
import Background from "@/components/home/Background";
import ContactTab from "@/components/home/ContactTab";
import ProjectCard from "@/components/home/ProjectCard";
import SocialMediaProfile from "@/components/home/SocialMediaProfile";
import StackItem from "@/components/home/StackItem";
import Tab from "@/components/tabs/Tab";
import Tablist from "@/components/tabs/Tablist";

export default function Home() {
    return (<>
        <Background />
        <main
            className="absolute-center lg:w-[45%] md:w-2/3 w-full max-h-[75%] transition-[height] p-5 rounded-lg border-[3px] border-primary bg-bg-light drop-shadow-xl overflow-scroll"
        >
            <Tablist
                tabs={["Profile", "Stack", "Projects", "Contact"]}
                activeTab="Profile"
            >
                <Tab name="Profile">
                    <div className="flex flex-col">
                        <div className="flex flex-row gap-3 items-center">
                            <img src="/avatar.webp" alt="Avatar" className="rounded-full w-[50px] md:w-[100px]" />
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
                </Tab>
                <Tab name="Stack">
                    <div className="flex flex-col gap-5">
                        <StackItem title="TypeScript" icon={SiTypescript}>
                            My main language for basically everything. I often use TypeScript over JavaScript for its type safety.
                            Type safety is extremely important to me and I can't live without it.
                        </StackItem>
                        <StackItem title="Tailwind CSS" icon={SiTailwindcss}>
                            I use Tailwind for styling my websites. Yes, the classnames do get really long, but I much prefer it over writing CSS.
                        </StackItem>
                        <StackItem title="NextJS" icon={SiNextdotjs}>
                            NextJS is by far my favorite web framework. It is super easy to get up and running and has support for many libraries,
                            and has server-side rendering out of the box.
                        </StackItem>

                        <Divider />

                        <StackItem title="NodeJS" icon={SiNodedotjs}>
                            NodeJS is the lifeblood for any TypeScript or JavaScript project. I use it for my Discord bots and web servers.
                        </StackItem>

                        <Divider />

                        <StackItem title="Prisma" icon={SiPrisma}>
                            I use Prisma for my database needs. It's super easy to use and has a very user-friendly interface.
                        </StackItem>

                        <StackItem title="PostgreSQL" icon={SiPostgresql}>
                            PostgreSQL is my go-to database. It's very powerful and has a lot of features that I use often.
                        </StackItem>

                        <Divider />

                        <StackItem title="Oracle Cloud" icon={SiOracle}>
                            Oracle Cloud provides a pretty good free tier, so I have a VPS with them for hosting small websites and servers.
                        </StackItem>

                        <StackItem title="Vercel" icon={SiVercel}>
                            I use Vercel for hosting basic websites/webservers. It's super user-friendly and for my needs, completely free.
                            They also made NextJS, so it's perfect if I need to host a Next website.
                        </StackItem>

                        <Divider />

                        <StackItem title="VSCode" icon={SiVisualstudiocode}>
                            VSCode is my go-to code editor. It's fast and really simple.
                        </StackItem>

                        <StackItem title="IntelliJ IDEA" icon={SiIntellijidea}>
                            I use IntelliJ IDEA for Java and Kotlin projects. It's a very powerful IDE, and simplifies building and running Java projects.
                        </StackItem>

                        <StackItem title="JetBrains Rider" icon={SiRider}>
                            I use Rider for Unity projects, as it has better support for C# than VSCode, and I like it much better over Visual Studio.
                        </StackItem>

                        <Divider />

                        <StackItem title="Java" icon={DiJava}>
                            I have worked with Java for making Minecraft plugins and sometimes mods. No, I don't like it.
                        </StackItem>

                        <StackItem title="Kotlin" icon={SiKotlin}>
                            I have also used Kotlin for Minecraft plugins, and it is very enjoyable to work with, but there are some things I still don't understand about it.
                        </StackItem>

                        <Divider />

                        <StackItem title="Unity" icon={SiUnity}>
                            I have used Unity for making games. It's a simple and powerful engine that I enjoy using.
                        </StackItem>

                        <StackItem title="C#" icon={SiCsharp}>
                            I use C# for Unity projects, obviously.
                        </StackItem>

                        <Divider />

                        <StackItem title="C++" icon={SiCplusplus}>
                            I use C++ for my microcontroller projects. I'm not an engineer, I just like messing around with them sometimes.
                        </StackItem>
                    </div>
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
                <Tab name="Contact">
                    <ContactTab />
                </Tab>
            </Tablist>
        </main>
    </>);
}
