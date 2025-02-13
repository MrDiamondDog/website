import { Metadata } from "next";
import { remark } from "remark";
import html from "remark-html";

import Divider from "@/components/general/Divider";
import Subtext from "@/components/general/Subtext";
import { getContent, getPost } from "@/lib/blog";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    const post = await getPost(slug);
    if (!post)
        return {
            title: "404",
            description: "This post does not exist",
        };

    return {
        title: post.title,
        description: post.description,
    };
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const post = await getPost(slug);
    if (!post)
        return <h1>404</h1>;

    const postContent = await getContent(slug);

    const processedContent = await remark()
        .use(html)
        .process(postContent);
    const contentHtml = processedContent.toString();

    return (<main
        className="absolute-center w-full md:w-2/3 p-4 md:p-10 max-h-[95%] bg-bg-light rounded-lg drop-shadow-xl h-full relative"
    >
        <div className="h-full text-wrap overflow-scroll markdown">
            <a href="/">&lt; Go back</a>
            <h1 className="text-4xl font-bold pt-4 pb-3">{post.title}</h1>
            <p>{post.description}</p>
            <Subtext className="!pt-0">{post.created}</Subtext>
            <Divider />
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} className="overflow-x-hidden" />
        </div>
    </main>);
}
