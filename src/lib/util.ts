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

const rainbow = [
    "hsl(0, 100%, 50%)", // Red
    "hsl(20, 100%, 50%)", // Red-Orange
    "hsl(40, 100%, 50%)", // Orange
    "hsl(60, 100%, 50%)", // Yellow
    "hsl(80, 100%, 50%)", // Yellow-Green
    "hsl(100, 100%, 50%)", // Green
    "hsl(120, 100%, 50%)", // Green
    "hsl(140, 100%, 50%)", // Green-Cyan
    "hsl(160, 100%, 50%)", // Cyan
    "hsl(180, 100%, 50%)", // Cyan-Blue
    "hsl(200, 100%, 50%)", // Blue
    "hsl(220, 100%, 50%)", // Blue-Indigo
    "hsl(240, 100%, 50%)", // Indigo
    "hsl(260, 100%, 50%)", // Indigo-Violet
    "hsl(280, 100%, 50%)", // Violet
    "hsl(300, 100%, 50%)" // Magenta
];

export function color(i: number) {
    return rainbow[i % 16];
}

export function toDate(date: Date): `${number}/${number}` {
    return `${date.getMonth() + 1}/${date.getDate()}`;
}

/**
 * Returns a number n such that min <= n < max
 */
export function randomRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export function randomFrom(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}
