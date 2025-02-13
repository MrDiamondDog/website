import { DiJava } from "react-icons/di";
import { PiFileCSharp } from "react-icons/pi";
import {
    SiCplusplus, SiIntellijidea, SiKotlin, SiNextdotjs, SiNodedotjs, SiOracle, SiPostgresql,
    SiPrisma, SiRider, SiTailwindcss, SiTypescript, SiUnity, SiVercel,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";

import Divider from "../general/Divider";
import StackItem from "./StackItem";

export default function StackTab() {
    return (
        <div className="flex flex-col gap-5 mb-5">
            <StackItem title="TypeScript" icon={SiTypescript} link="https://www.typescriptlang.org/">
                My main language for basically everything. I often use TypeScript over JavaScript for its type safety.
                Type safety is extremely important to me and I can't live without it.
            </StackItem>
            <StackItem title="Tailwind CSS" icon={SiTailwindcss} link="https://tailwindcss.com/">
                I use Tailwind for styling my websites. Yes, the classnames do get really long, but I much prefer it over writing CSS.
            </StackItem>
            <StackItem title="NextJS" icon={SiNextdotjs} link="https://nextjs.org/">
                NextJS is my favorite web framework. It is super easy to get up and running and has support for many libraries,
                and has server-side rendering out of the box.
            </StackItem>

            <Divider />

            <StackItem title="NodeJS" icon={SiNodedotjs} link="https://nodejs.org/">
                NodeJS is the lifeblood for any TypeScript or JavaScript project. I use it for my Discord bots and web servers.
            </StackItem>

            <Divider />

            <StackItem title="Prisma" icon={SiPrisma} link="https://www.prisma.io/">
                I use Prisma for my database needs. It's super easy to use and has a very user-friendly interface.
            </StackItem>

            <StackItem title="PostgreSQL" icon={SiPostgresql} link="https://www.postgresql.org/">
                PostgreSQL is my go-to database. It's very powerful and has a lot of features that I use often.
            </StackItem>

            <Divider />

            <StackItem title="Oracle Cloud" icon={SiOracle} link="https://www.oracle.com/cloud/">
                Oracle Cloud provides a pretty good free tier, so I have a VPS with them for hosting small websites and servers.
            </StackItem>

            <StackItem title="Vercel" icon={SiVercel} link="https://www.oracle.com/cloud/">
                I use Vercel for hosting basic websites/webservers. It's super user-friendly and for my needs, completely free.
                They also made NextJS, so it's perfect if I need to host a Next website.
            </StackItem>

            <Divider />

            <StackItem title="VSCode" icon={VscVscode} link="https://code.visualstudio.com/">
                VSCode is my go-to code editor. It's fast and really simple.
            </StackItem>

            <StackItem title="IntelliJ IDEA" icon={SiIntellijidea} link="https://www.jetbrains.com/idea/">
                I use IntelliJ IDEA for Java and Kotlin projects.
                It's a very powerful IDE, and simplifies building and running Java projects.
            </StackItem>

            <StackItem title="JetBrains Rider" icon={SiRider} link="https://www.jetbrains.com/rider/">
                I use Rider for Unity projects, as it has better support for C# than VSCode,
                and I like it much better over Visual Studio.
            </StackItem>

            <Divider />

            <StackItem title="Java" icon={DiJava} link="https://en.wikipedia.org/wiki/Torture">
                I have worked with Java for making Minecraft plugins and sometimes mods. No, I don't like it.
            </StackItem>

            <StackItem title="Kotlin" icon={SiKotlin} link="https://kotlinlang.org/">
                I have also used Kotlin for Minecraft plugins, and it is very enjoyable to work with,
                but there are some things I still don't understand about it.
            </StackItem>

            <Divider />

            <StackItem title="Unity" icon={SiUnity} link="https://unity.com/">
                I have used Unity for making games. It's a simple and powerful engine that I enjoy using.
            </StackItem>

            <StackItem title="C#" icon={PiFileCSharp} link="https://dotnet.microsoft.com/en-us/languages/csharp">
                I use C# for Unity projects, obviously.
            </StackItem>

            <Divider />

            <StackItem title="C++" icon={SiCplusplus} link="https://cplusplus.com/">
                I use C++ for my microcontroller projects. I'm not an engineer, I just like messing around with them sometimes.
            </StackItem>
        </div>
    );
}
