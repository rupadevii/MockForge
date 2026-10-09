import { NextResponse } from "next/server";
import { apiLimiter, createLimiter } from "./lib/rateLimit";

export async function proxy(request){
    console.log("proxy hit:", request.method, request.nextUrl.pathname);
    if(request.method === "OPTIONS"){
        return NextResponse.next()
    }

    const {pathname, searchParams} = request.nextUrl
    const limiter = pathname === "/api/workspaces" ? createLimiter : apiLimiter

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "anonymous"

    try {
        const {success} = await limiter.limit(ip)
        if(!success){
            return NextResponse.json(
                { error: "Too many requests, try again soon"},
                { status: 429 }
            )
        }
    } catch (error) {
        console.log("Rate limiter failed:", error.message)
    }

    if (!pathname.startsWith("/api/mock/")) {
        return NextResponse.next();
    }

    const delay = Number(searchParams.get("_delay"))

    const status = Number(searchParams.get("_status"))

    if(delay && delay>0){
        await new Promise((resolve) => setTimeout(resolve, Math.min(delay, 5000)))
    }

    if(status >= 400 && status<=599){
        return NextResponse.json({error: "Simulated error"}, {status})
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/api/mock/:path*", "/api/workspaces"]
}