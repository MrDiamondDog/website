import CanvasBackground from "@/components/home/CanvasBackground";
import ContactTab from "@/components/home/ContactTab";
import Divider from "@/components/general/Divider";
import Oneko from "@/components/general/Oneko";
import ProjectCard from "@/components/home/ProjectCard";
import StackItem from "@/components/home/StackItem";
import Subtext from "@/components/general/Subtext";
import Tab from "@/components/tabs/Tab";
import Tablist from "@/components/tabs/Tablist";
import { DiJava } from "react-icons/di";
import { FaDiscord, FaGithub, FaGlobe } from "react-icons/fa6";
import { MdRamenDining } from "react-icons/md";
import { SiCplusplus, SiCsharp, SiIntellijidea, SiKotlin, SiNextdotjs, SiNodedotjs, SiOracle, SiPostgresql, SiPrisma, SiRider, SiTailwindcss, SiTypescript, SiUnity, SiVercel, SiVisualstudiocode } from "react-icons/si";
import { TbBrandMinecraft } from "react-icons/tb";
import { getPosts } from "@/lib/posts";
import SocialMediaProfile from "@/components/home/SocialMediaProfile";

export default function Home() {
  return (<>
    <CanvasBackground />
    <main 
      className="absolute-center lg:w-1/2 md:w-2/3 w-full h-2/3 p-5 rounded-lg border-[3px] border-primary bg-bg-light drop-shadow-xl overflow-scroll"
    >
      <Tablist
        tabs={["Profile", "Stack", "Projects", "Blog", "Contact"]}
        activeTab="Profile"
      >
        <Tab name="Profile">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-3 items-center">
              <img src="./avatar.webp" alt="Avatar" className="rounded-full w-[50px] md:w-[100px]" />
              <div>
                <h1 className="text-sm md:text-3xl">MrDiamondDog</h1>
                <Subtext>He/Him</Subtext>
              </div>
            </div>

            <div className="flex flex-col gap-2">
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
          <div className="flex flex-row flex-wrap gap-5">
            <ProjectCard icon={FaGlobe} title="Website" tags={["NextJS", "TypeScript", "TailwindCSS"]} link="https://github.com/MrDiamondDog/website">
              This website!
            </ProjectCard>
            <ProjectCard icon={MdRamenDining} title="Ramen" tags={["NextJS", "TypeScript", "TailwindCSS"]}>
              A student productivity app, no longer in development. Was meant to replace <a href="https://noodle.run/">Noodle</a>.
            </ProjectCard>
            <ProjectCard icon={FaDiscord} title="No Ugly Icons" tags={["Discord"]} link="https://github.com/MrDiamondDog/noUglyIconsTheme">
              A theme for Discord that removes all the new, ugly icons. Mostly maintained by <a href="https://github.com/thororen1234">Thororen</a>.
            </ProjectCard>
          </div>
          <Divider />
          <p>Not my projects, but ones that I've contributed to or just really like:</p>
          <div className="flex flex-row flex-wrap gap-5">
            <ProjectCard icon={Oneko} title="Vencord" tags={["Discord", "TypeScript"]} link="https://vencord.dev/">
              A Discord client mod that adds a ton of features to Discord, without the lag of BetterDiscord.
            </ProjectCard>
            <ProjectCard icon={TbBrandMinecraft} title="TypeWriter" tags={["Minecraft", "Plugin"]} link="https://docs.typewritermc.com/">
              The next generation of Minecraft questing plugins. It makes quests, cutscenes, and dialog extremely easy to make, without any programming knowledge.
              It has a ton of features and extensive documentation.
            </ProjectCard>
            <ProjectCard icon={MdRamenDining} title="Noodle" tags={["NextJS", "TypeScript"]} link="https://noodle.run/">
              A student productivity app that I am really looking forward using.
            </ProjectCard>
          </div>
        </Tab>
        <Tab name="Blog">
          <p>Just things I find interesting and decide to write about</p>
          <Divider />
          <div>
            {getPosts().map((post) => {
              return (
                <div key={post.slug} className="px-2">
                  <h2><a href={`/blog/${post.slug}`}>{post.title}</a></h2>
                  <Subtext>{post.date}</Subtext>
                  <p>{post.description}</p>
                </div>
              );
            })}
          </div>
        </Tab>
        <Tab name="Contact">
          <ContactTab />
        </Tab>
      </Tablist>
    </main>
  </>);
}
