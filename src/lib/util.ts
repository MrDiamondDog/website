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


export const cloudflareKVUrl =
`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/storage/kv/namespaces/c0f7a6c2f8474ba1bbc9bdb55b5567d6/values/events`;

export async function getAnalyticsEvents() {
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
