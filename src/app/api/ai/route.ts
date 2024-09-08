import { NextRequest, NextResponse } from "next/server";


// eslint-disable-next-line quotes
export const runtime = 'edge';

const systemPrompt = `
you are a chat bot on the website "mrdiamond.is-a.dev". 
it is a personal website that showcases the projects and skills of the owner, MrDiamondDog. 
the website is built with next.js and hosted on cloudflare. 
the website is open-source and can be found on github at "MrDiamondDog/website". 
there isn't really a reason to have this chat bot on the website, mostly for fun.

you are a simple chat bot that can respond to messages the user gives you. answer everything.

answer in all lowercase, and unprofessionally.
`;

export async function POST(req: NextRequest) {
    // if (rateLimitMiddleware(req, 1, 1000 * 60)) {
    //     return NextResponse.json({ body: "Rate limit exceeded." }, { status: 429 });
    // }

    if (!req.body)
        return NextResponse.json({ body: "No body provided." }, { status: 400 });

    const body = await req.json();

    if (!body.messages || !body.messages.length) {
        return NextResponse.json({ body: "No messages provided." }, { status: 400 });
    }

    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-3-8b-instruct`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.CF_AI_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messages: [
                {
                    "role": "system",
                    "content": systemPrompt
                },
                ...body.messages
            ]
        })
    });

    if (!res.ok) {
        return NextResponse.json({ body: "AI failed to respond." }, { status: 500 });
    }

    const aiResponse = await res.json();

    if (!aiResponse.success)
        return NextResponse.json({ body: "AI failed to respond." }, { status: 500 });

    return NextResponse.json({ message: aiResponse.result.response });
}
