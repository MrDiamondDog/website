import { NextRequest, NextResponse } from "next/server";

import { getNewState, State } from "@/lib/words";

import rateLimitMiddleware from "..";

// eslint-disable-next-line quotes
export const runtime = 'edge';

async function getState() {
    return await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/storage/kv/namespaces/${process.env.CF_KV_ID}/values/state`, {
        headers: {
            "Authorization": `Bearer ${process.env.CF_KV_TOKEN}`
        }
    }).then(res => res.text()).then(JSON.parse);
}

async function setState(newState: State) {
    return await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/storage/kv/namespaces/${process.env.CF_KV_ID}/values/state`, {
        method: "PUT",
        headers: {
            "Content-Type": "text/plain",
            "Authorization": `Bearer ${process.env.CF_KV_TOKEN}`
        },
        body: JSON.stringify(newState)
    });
}

export async function GET(req: NextRequest) {
    const state = await getState();

    return NextResponse.json(state);
}

export async function POST(req: NextRequest) {
    if (rateLimitMiddleware(req, 1, 1000 * 60))
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    if (!req.body)
        return NextResponse.json({ error: "No body provided" }, { status: 400 });

    const key = await req.text();

    console.log(await getState(), key, getNewState(await getState(), key));

    await setState(getNewState(await getState(), key));

    return NextResponse.json({ success: true });
}
