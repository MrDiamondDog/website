import { NextRequest, NextResponse } from "next/server";

import rateLimitMiddleware from "..";

export const runtime = "edge";

export async function POST(req: NextRequest) {
    if (rateLimitMiddleware(req)) {
        return NextResponse.json({ body: "Rate limit exceeded." }, { status: 429 });
    }

    if (!process.env.DISCORD_WEBHOOK)
        return NextResponse.json({ body: "No Discord webhook set up." }, { status: 500 });

    if (!req.body)
        return NextResponse.json({ body: "No body provided." }, { status: 400 });

    const body = await req.json();

    if (!body.discord || !body.subject || !body.message)
        return NextResponse.json({ body: "Please fill out all of the fields." }, { status: 400 });

    if (body.discord.length > 20 || body.subject.length > 256 || body.message.length > 2048)
        return NextResponse.json({ body: "Fields are too long." }, { status: 400 });

    await fetch(process.env.DISCORD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            embeds: [{
                type: "rich",
                title: body.subject,
                description: body.message,
                color: 0x3181bf,
                author: {
                    name: body.discord,
                },
                timestamp: new Date().toISOString(),
            }]
        }),
    }).then(res => {
        if (!res.ok) throw new Error("Failed to send message.");
    }).catch(() => {
        return NextResponse.json({ body: "Failed to send message." }, { status: 500 });
    });

    return NextResponse.json({ body: "Message sent. Expect a response... eventually." }, { status: 200 });
}
