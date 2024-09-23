import { APIUser } from "discord-api-types/v10";

export const scopes = [
    "identify"
];

export const redirectUri = (process.env.PRODUCTION || process.env.NEXT_PUBLIC_PRODUCTION) ? "https://mrdiamond.is-a.dev/" : "http://localhost:3000/";

export function authUrl(clientId?: string, redirect?: string, state?: string) {
    return `https://discord.com/oauth2/authorize?client_id=${clientId ?? process.env.DISCORD_OAUTH_ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri + (redirect ?? ""))}&scope=identify${state ? `&state=${state}` : ""}`;
}

export async function refreshToken(token: string) {
    const body = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token
    });

    const res = await fetch("https://discord.com/api/v10/oauth2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(process.env.DISCORD_OAUTH_ID + ":" + process.env.DISCORD_OAUTH_SECRET)
        },
        body
    });

    return await res.json();
}

export async function accessToken(oauthCode: string, redirect?: string) {
    const body = new URLSearchParams({
        code: oauthCode,
        grant_type: "authorization_code",
        redirect_uri: redirectUri + (redirect ?? ""),
    });

    const res = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(process.env.DISCORD_OAUTH_ID + ":" + process.env.DISCORD_OAUTH_SECRET)
        },
        body
    });

    return await res.json();
}

export async function deleteToken(token: string, hint?: "access_token" | "refresh_token") {
    const body = new URLSearchParams({
        token,
        token_type_hint: hint
    });

    const res = await fetch("https://discord.com/api/oauth2/token/revoke", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(process.env.DISCORD_OAUTH_ID + ":" + process.env.DISCORD_OAUTH_SECRET)
        },
        body
    });

    return await res.json();
}

export async function getUser(token: string): Promise<APIUser> {
    return await fetch("https://discord.com/api/v10/users/@me", {
        headers: {
            "Authorization": "Bearer " + token
        }
    }).then(res => res.json());
}
