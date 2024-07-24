import Button from "@/components/Button";
import Divider from "@/components/Divider";
import { getPostBySlug, getPostContentBySlug } from "@/lib/posts";
import { Metadata } from "next";
import { IoIosArrowUp } from "react-icons/io";
import { remark } from "remark";
import html from 'remark-html';

export function generateMetadata({ params: { slug } }: { params: { slug: string }}): Metadata {
    const post = getPostBySlug(slug);
    if (!post)
        return {
            title: "404",
            description: "This post does not exist"
        };

    return {
        title: post.title,
        description: post.description
    };
}

export default async function BlogPage({ params: { slug } }: { params: { slug: string } }) {
    const post = getPostBySlug(slug);
    if (!post)
        return <h1>404</h1>;

    const postContent = getPostContentBySlug(slug);

    const processedContent = await remark()
        .use(html)
        .process(postContent);
    const contentHtml = processedContent.toString();

    return (<main className="absolute-center w-full md:w-2/3 p-4 md:p-10 bg-bg-light rounded-lg drop-shadow-xl h-full relative">
        <div className="h-full text-wrap overflow-scroll markdown">
            <a href="/">&lt; Go back</a>
            <h1 className="text-4xl font-bold pt-4 pb-3">{post.title}</h1>
            <p>{post.description}</p>
            <Divider />
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} className="overflow-x-hidden" />
        </div>
    </main>);
}