export type BlogPost = {
    title: string;
    slug: string;
    description: string;
    created: string;
    showInList?: boolean;
}

const endpoint = "https://server.mrdiamond.is-a.dev/blogs";

export async function getPosts(): Promise<BlogPost[]> {
    const res = await fetch(endpoint + "/index.json");
    return await res.json();
}

export async function getPost(slug: string): Promise<BlogPost | null> {
    return await getPosts().then(posts => posts.find((post: BlogPost) => post.slug === slug));
}

export async function getContent(slug: string): Promise<string> {
    const res = await fetch(endpoint + "/" + slug + ".md");
    return await res.text();
}
