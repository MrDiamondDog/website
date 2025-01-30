import { NextRequest, NextResponse } from "next/server";

import rateLimitMiddleware from "..";

// eslint-disable-next-line quotes
export const runtime = 'edge';

export async function POST(req: NextRequest) {
    if (rateLimitMiddleware(req, 1, 1000 * 60)) {
        return NextResponse.json({ body: "Rate limit exceeded." }, { status: 429 });
    }

    if (!process.env.DISCORD_WEBHOOK)
        return NextResponse.json({ body: "No Discord webhook set up." }, { status: 500 });

    if (!req.body)
        return new Response("No body", { status: 400 });

    const file = await req.blob();

    if (!file)
        return new Response("No file", { status: 400 });

    if (file.type !== "image/png")
        return new Response("Invalid Image", { status: 400 });

    const data = await new Response(file).arrayBuffer();
    const dv = new DataView(data);
    const width = dv.getInt32(16, false);
    const height = dv.getInt32(20, false);

    if (width !== 350 || height !== 350)
        return new Response("Invalid Image", { status: 400 });

    const body = new FormData();

    body.append("files[0]", file, "drawing.png");

    await fetch(process.env.DISCORD_WEBHOOK, {
        method: "POST",
        body,
    }).then(res => {
        if (!res.ok)
            throw new Error("Failed to send message.");
    })
        .catch(() => NextResponse.json({ body: "Failed to send message." }, { status: 500 }));

    return NextResponse.json({ body: "Success" });
}
