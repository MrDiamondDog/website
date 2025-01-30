import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getUser } from "@/lib/discord";

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
        return NextResponse.json({ body: "No body provided." }, { status: 400 });

    const body = await req.json();

    if (!body.userId || !body.subject || !body.message)
        return NextResponse.json({ body: "Please fill out all of the fields." }, { status: 400 });

    if (body.subject.length > 256 || body.message.length > 2048)
        return NextResponse.json({ body: "Fields are too long." }, { status: 400 });

    const accessToken = (await cookies()).get("access_token")?.value;

    if (!accessToken)
        return NextResponse.json({ body: "Unauthorized" }, { status: 403 });

    const user = await getUser(accessToken);

    if (user?.id && user.id !== body.userId)
        return NextResponse.json({ body: "Unauthorized" }, { status: 403 });

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
                    name: user.username,
                    icon_url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
                },
                timestamp: new Date().toISOString(),
            }],
        }),
    }).then(res => {
        if (!res.ok)
            throw new Error("Failed to send message.");
    })
        .catch(() => NextResponse.json({ body: "Failed to send message." }, { status: 500 }));

    return NextResponse.json({ body: "Message sent. Expect a response... eventually." }, { status: 200 });
}
