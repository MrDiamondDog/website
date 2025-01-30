import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { accessToken, deleteToken, refreshToken } from "@/lib/discord";

// eslint-disable-next-line quotes
export const runtime = 'edge';

export async function GET(req: NextRequest) {
    const cookie = await cookies();

    if (req.nextUrl.searchParams.has("clientId"))
        return NextResponse.json({ clientId: process.env.DISCORD_OAUTH_ID });

    if (req.nextUrl.searchParams.has("token")) {
        if (!cookie.has("access_token") && cookie.has("refresh_token")) {
            const json = await refreshToken(cookie.get("refresh_token").value);

            const headers = new Headers([
                ["Set-Cookie", `access_token=${json.access_token}; Max-Age=${json.expires_in}; SameSite=Strict; Path=/`],
                ["Set-Cookie", `refresh_token=${json.refresh_token}; Max-Age=${1000 * 60 * 60 * 24 * 7}; SameSite=Strict; Path=/`],
            ]);

            if (json.error || json.message) {
                return NextResponse.json(json, { status: 500 });
            }

            return NextResponse.json({ access_token: json.access_token, refreshed: true }, { headers });
        }

        return NextResponse.json({ access_token: cookie.get("access_token")?.value ?? "" });
    }

    return NextResponse.json({ error: "No search param" }, { status: 400 });
}

export async function POST(req: NextRequest) {
    if (!req.nextUrl.searchParams.has("code"))
        return NextResponse.json({ error: "No code" });

    const code = req.nextUrl.searchParams.get("code");
    const state = req.nextUrl.searchParams.get("state");
    const json = await accessToken(code, state ? atob(state) : undefined);

    if (json.error)
        return NextResponse.json(json, { status: 400 });

    const headers = new Headers([
        ["Set-Cookie", `access_token=${json.access_token}; Max-Age=${json.expires_in}; SameSite=Strict; Path=/`],
        ["Set-Cookie", `refresh_token=${json.refresh_token}; Max-Age=${1000 * 60 * 60 * 24 * 7}; SameSite=Strict; Path=/`],
    ]);

    return NextResponse.json(json, {
        headers,
    });
}

export async function DELETE(req: NextRequest) {
    const cookie = await cookies();

    if (!cookie.has("access_token") && !cookie.has("refresh_token"))
        return NextResponse.json({}, { status: 403 });

    const headers = new Headers([
        ["Set-Cookie", "access_token=; Max-Age=0; SameSite=Strict; Path=/"],
        ["Set-Cookie", "refresh_token=; Max-Age=0; SameSite=Strict; Path=/"],
    ]);

    if (cookie.has("access_token"))
        await deleteToken(cookie.get("access_token").value, "access_token");
    if (cookie.has("refresh_token"))
        await deleteToken(cookie.get("refresh_token").value, "refresh_token");

    return NextResponse.json({ message: "OK" }, { headers });
}
