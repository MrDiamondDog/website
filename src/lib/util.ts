export interface Vec2 {
    x: number;
    y: number;
}

export const colors = {
    primary: "#3181bf",
    secondary: "#1e5178",
    tertiary: "#143b59",

    background: "#17181a",
    backgroundLight: "#1f2124",
    backgroundLighter: "#242930",
};

export type AnalyticsEvent = {
    type: "pageview";
    from?: string;
    isMobile: boolean;
    path: string;
    country: string;
    timestamp: Date;
};

export const validVisitedFrom = ["twitter", "github", "discord", "unknown"];
export type AnalyticsEntry = {
    date: `${number}/${number}`;
    country: Record<string, number>;
    route: Record<string, number>;
    from: Record<string, number>;
    device: Partial<Record<"desktop" | "mobile", number>>;
};

export const cloudflareKVUrl =
`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/storage/kv/namespaces/c0f7a6c2f8474ba1bbc9bdb55b5567d6/values/events`;

export async function getAnalyticsEntries() {
    if (!process.env.CF_ACCOUNT_ID || !process.env.CF_ACCOUNT_TOKEN) {
        throw new Error("Cloudflare credentials not set.");
    }

    return fetch(cloudflareKVUrl, {
        headers: {
            Authorization: `Bearer ${process.env.CF_ACCOUNT_TOKEN}`,
        },
    }).then(async res => {
        if (!res.ok) {
            throw new Error("Failed to fetch events; " + await res.text());
        }
        return res.text();
    }).then(JSON.parse);
}


// like Math.random() but with a seed
export function seededRandom(seed: string | number) {
    if (typeof seed === "string") {
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = (hash << 5) - hash + seed.charCodeAt(i);
            hash |= 0;
        }
        seed = hash;
    }

    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

export function randomColor(seed?: string | number) {
    const random = seed !== undefined ? seededRandom(seed) : Math.random();
    return `hsl(${random * 360}, 100%, 50%)`;
}

export function toDate(date: Date): `${number}/${number}` {
    return `${date.getMonth() + 1}/${date.getDate()}`;
}
