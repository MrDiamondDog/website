import { NextRequest, NextResponse } from "next/server";

import { AnalyticsEvent, cloudflareKVUrl, getAnalyticsEvents } from "@/lib/util";

// eslint-disable-next-line quotes
export const runtime = 'edge';

const validVisitedFrom = ["twitter", "github", "discord", "unknown"];

async function getCountry(ip: string) {
    const url = `http://ip-api.com/json/${ip}?fields=status,message,country`;

    return fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.status === "fail") {
                return "unknown";
            }

            return data.country;
        })
        .catch(() => "unknown");
}

async function logEvent(event: AnalyticsEvent) {
    if (!process.env.CF_ACCOUNT_ID || !process.env.CF_ACCOUNT_TOKEN) {
        throw new Error("Cloudflare credentials not set.");
    }

    const form = new FormData();
    form.append("metadata", "{}");
    form.append("value", await getAnalyticsEvents().then(events => {
        events.push(event);
        return JSON.stringify(events);
    }));

    await fetch(cloudflareKVUrl, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${process.env.CF_ACCOUNT_TOKEN}`,
        },
        body: form,
    }).then(async res => {
        if (!res.ok) {
            throw new Error("Failed to log event; " + await res.text());
        }
    });
}

export async function POST(req: NextRequest) {
    if (!req.body)
        return NextResponse.json({ body: "No body provided." }, { status: 400 });

    const body = await req.json();

    if (!body.type)
        return NextResponse.json({ body: "No type provided." }, { status: 400 });

    if (!["pageview"].includes(body.type))
        return NextResponse.json({ body: "Invalid type." }, { status: 400 });

    // check if from is valid
    if (body.from && !validVisitedFrom.includes(body.from))
        return NextResponse.json({ body: "Invalid 'from' value." }, { status: 400 });

    const ip = req.headers.get("x-forwarded-for") || req.ip || undefined;
    const country = ip ? await getCountry(ip) : "unknown";

    await logEvent({
        type: body.type,
        country,
        from: body.from,
        isMobile: body.isMobile || false,
        path: body.path || "/",
        timestamp: new Date(),
    });

    return NextResponse.json({ body: "success" }, { status: 200 });
}

export async function GET() {
    const events = await getAnalyticsEvents().catch(() => []);
    return NextResponse.json(events);
}
