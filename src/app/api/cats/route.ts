import { NextRequest, NextResponse } from "next/server";
import { randomStr } from "objective-canvas";

import { createOrUpdateFile, createPullRequest, getFileContents, newBranch, repository, username } from "@/lib/github";

import rateLimitMiddleware from "..";


// eslint-disable-next-line quotes
export const runtime = 'edge';

export async function POST(req: NextRequest) {
    if (rateLimitMiddleware(req, 1, 1000 * 60)) {
        return NextResponse.json({ body: "Rate limit exceeded." }, { status: 429 });
    }

    if (!req.body)
        return NextResponse.json({ body: "No body provided." }, { status: 400 });

    const body = await req.formData();

    if (!body.has("name") || !body.has("image"))
        return NextResponse.json({ body: "No name or image provided." }, { status: 400 });

    const name = body.get("name") as string;
    const file = body.get("image") as File;

    if (!file.type.startsWith("image/"))
        return NextResponse.json({ body: "Invalid image." }, { status: 400 });

    const branchName = randomStr(16);
    try {
        const image = Buffer.from(await file.arrayBuffer()).toString("base64");

        await newBranch(branchName);
        await createOrUpdateFile(branchName, `cats/${file.name}`, `Add ${file.name}`, image);

        const listFile = await getFileContents(branchName, "list.json");
        // @ts-expect-error i don't know what the type is supposed to be because octokit types are cryptic as fuck
        const list: { name: string, src: string }[] = JSON.parse(Buffer.from(listFile.content, "base64").toString("utf-8"));
        list.push({ name, src: file.name });

        // @ts-expect-error same thing
        await createOrUpdateFile(branchName, "list.json", "Update list.json", Buffer.from(JSON.stringify(list, null, 4)).toString("base64"), listFile.sha);

        await createPullRequest(branchName, name, `![image](https://raw.githubusercontent.com/${username}/${repository}/${branchName}/cats/${file.name})`);
    } catch (e: any) {
        return NextResponse.json({ error: (e as Error).message, full: (e as Error) }, { status: 500 });
    }

    return NextResponse.json({ message: "Success", branchName });
}
