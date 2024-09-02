import { NextRequest, NextResponse } from "next/server";

import { AnalyticsEntry, AnalyticsEvent, cloudflareKVUrl, getAnalyticsEntries, toDate } from "@/lib/util";

// eslint-disable-next-line quotes
export const runtime = 'edge';

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

async function logEvent(newEvent: AnalyticsEvent) {
    if (!process.env.CF_ACCOUNT_ID || !process.env.CF_ACCOUNT_TOKEN) {
        throw new Error("Cloudflare credentials not set.");
    }

    const form = new FormData();
    form.append("metadata", "{}");
    form.append("value", await getAnalyticsEntries().then((existingEvents: AnalyticsEntry[]) => {
        let currentEvent = existingEvents.find(e => toDate(newEvent.timestamp) === e.date);
        if (!currentEvent) {
            existingEvents.push({
                date: toDate(newEvent.timestamp),
                country: {},
                route: {},
                from: {},
                device: {},
                uniqueVisitors: [],
                totalVisitors: 0
            });
            currentEvent = existingEvents[existingEvents.length - 1];
        }

        currentEvent.country[newEvent.country] = (currentEvent.country[newEvent.country] || 0) + 1;
        currentEvent.route[newEvent.path] = (currentEvent.route[newEvent.path] || 0) + 1;
        if (newEvent.from) currentEvent.from[newEvent.from] = (currentEvent.from[newEvent.from] || 0) + 1;
        currentEvent.device[newEvent.isMobile ? "mobile" : "desktop"] = (currentEvent.device[newEvent.isMobile ? "mobile" : "desktop"] || 0) + 1;
        if (!currentEvent.uniqueVisitors.includes(newEvent.ip)) currentEvent.uniqueVisitors.push(newEvent.ip);
        currentEvent.totalVisitors++;


        const uniqueCountries = new Set<string>();
        const uniqueRoutes = new Set<string>();
        const uniqueDevices = ["desktop", "mobile"];
        const uniqueFrom = new Set<string>();

        existingEvents.forEach((entry: AnalyticsEntry) => {
            Object.keys(entry.country).forEach(country => uniqueCountries.add(country));
            Object.keys(entry.route).forEach(route => uniqueRoutes.add(route));
            Object.keys(entry.from).forEach(from => uniqueFrom.add(from));
        });

        for (const entry of existingEvents) {
            for (const country of uniqueCountries) {
                if (!entry.country[country]) {
                    entry.country[country] = 0;
                }
            }

            for (const route of uniqueRoutes) {
                if (!entry.route[route]) {
                    entry.route[route] = 0;
                }
            }

            for (const device of uniqueDevices) {
                if (!entry.device[device]) {
                    entry.device[device] = 0;
                }
            }

            for (const from of uniqueFrom) {
                if (!entry.from[from]) {
                    entry.from[from] = 0;
                }
            }

            if (entry.uniqueVisitors === undefined)
                entry.uniqueVisitors = [];

            if (entry.totalVisitors === undefined)
                entry.totalVisitors = 0;
        }

        const emptyRouteObject: Record<string, number> = {};
        uniqueRoutes.forEach(route => {
            emptyRouteObject[route] = 0;
        });

        const emptyCountryObject: Record<string, number> = {};
        emptyCountryObject.unknown = 0;
        uniqueCountries.forEach(country => {
            emptyCountryObject[country] = 0;
        });

        const emptyFromObject: Record<string, number> = {};
        emptyFromObject.unknown = 0;
        uniqueFrom.forEach(country => {
            emptyFromObject[country] = 0;
        });

        // fill in missing days (past 30)
        const now = new Date();
        for (let i = 1; i <= 30; i++) {
            const date = new Date(now);
            date.setDate(now.getDate() - i);

            const existing = existingEvents.find(e => e.date === toDate(date));

            if (!existing) {
                existingEvents.push({
                    date: toDate(date),
                    country: emptyCountryObject,
                    route: emptyRouteObject,
                    from: emptyFromObject,
                    device: {
                        desktop: 0,
                        mobile: 0,
                    },
                    uniqueVisitors: [],
                    totalVisitors: 0
                });
            }
        }

        // sort by date
        existingEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return JSON.stringify(existingEvents);
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

    const ip = req.headers.get("x-forwarded-for") || req.ip || undefined;
    const country = ip ? await getCountry(ip) : "unknown";

    await logEvent({
        type: body.type,
        country,
        from: !body.from ? undefined : body.from,
        isMobile: body.isMobile || false,
        path: body.path || "/",
        timestamp: new Date(),
        ip
    });

    return NextResponse.json({ body: "success" }, { status: 200 });
}

export async function GET() {
    const events = await getAnalyticsEntries();
    return NextResponse.json(events);
}
