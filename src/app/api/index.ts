import { NextRequest } from "next/server";

const rateLimitMap = new Map();

export default function rateLimitMiddleware(req: NextRequest) {
    const ip = req.headers.get("x-real-ip");
    if (!ip) {
        return true;
    }
    const limit = 1; // Limiting requests to 1 per minute per IP
    const windowMs = 60 * 1000; // 1 minute
    
    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, {
            count: 0,
            lastReset: Date.now(),
        });
    }
    
    const ipData = rateLimitMap.get(ip);
    
    if (Date.now() - ipData.lastReset > windowMs) {
        ipData.count = 0;
        ipData.lastReset = Date.now();
    }
    
    if (ipData.count >= limit) {
        return true;
    }
    
    ipData.count += 1;
        
    return false;
}