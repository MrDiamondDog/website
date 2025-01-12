import { BlogPost as BlogPostType } from "@/lib/blog";

import Subtext from "../general/Subtext";

export default function BlogPost({ post }: { post: BlogPostType }) {
    if (post.showInList === false) return null;

    return (
        <a href={`/blog/${post.slug}`} className="no-style">
            <div className="bg-bg-lighter p-4 rounded-lg cursor-pointer border-2 border-transparent hover:border-primary transition-all">
                <h3 className="font-bold">{post.title}</h3>
                <p>{post.description}</p>
                <Subtext>{post.created}</Subtext>
            </div>
        </a>
    );
}
