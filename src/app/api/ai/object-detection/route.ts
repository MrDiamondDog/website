import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line quotes
export const runtime = 'edge';

export async function POST(req: NextRequest) {
    if (!req.body)
        return NextResponse.json({ body: "No file provided." }, { status: 400 });

    const blob = await req.blob();

    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/ai/run/@cf/facebook/detr-resnet-50`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.CF_AI_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: blob
    });

    if (!res.ok) {
        console.error(await res.json());
        return NextResponse.json({ body: "AI failed to respond." }, { status: 500 });
    }

    const aiResponse = await res.json();

    return NextResponse.json(aiResponse);
}
