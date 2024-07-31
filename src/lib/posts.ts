import fs from "fs";

export function getPostBySlug(slug: string) {
    if (!fs.existsSync(`./public/posts/${slug}`))
        return null;
    return JSON.parse(fs.readFileSync(`./public/posts/${slug}/info.json`, "utf-8"));
}

export function getPostContentBySlug(slug: string) {
    if (!fs.existsSync(`./public/posts/${slug}`))
        return null;
    return fs.readFileSync(`./public/posts/${slug}/index.md`, "utf-8");
}

export function getPosts() {
    return fs.readdirSync("./public/posts").map(file => {
        return getPostBySlug(file);
    });
}
