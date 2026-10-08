import { NextResponse } from "next/server";

export async function proxy(request){
    if(request.method === "OPTIONS"){
        return NextResponse.next()
    }

    const delay = Number(request.nextUrl.searchParams.get("_delay"))

    const status = Number(request.nextUrl.searchParams.get("_status"))

    if(delay && delay>0){
        await new Promise((resolve) => setTimeout(resolve, Math.min(delay, 5000)))
    }

    if(status >= 400 && status<=599){
        return NextResponse.json({error: "Simulated error"}, {status})
    }

    return NextResponse.next()
}

export const config = {
    matcher: "/api/mock/:path*"
}