import { NextRequest } from "next/server";

const rateLimitMap = new Map();

export default function rateLimitMiddleware(req: NextRequest, maxReqs: number, reqWindow: number) {
    const ip = req.headers.get("x-real-ip");
    if (!ip) {
        return true;
    }

    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, {
            count: 0,
            lastReset: Date.now(),
        });
    }

    const ipData = rateLimitMap.get(ip);

    if (Date.now() - ipData.lastReset > reqWindow) {
        ipData.count = 0;
        ipData.lastReset = Date.now();
    }

    if (ipData.count >= maxReqs) {
        return true;
    }

    ipData.count += 1;

    return false;
}
