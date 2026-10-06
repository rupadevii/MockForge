import dbConnect from "@/lib/dbConnect";
import { MockRecord } from "@/models/MockRecord";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

export async function OPTIONS(){
    return new Response(null, {status: 204})
}

export async function POST(request, {params}){
    try{
        await dbConnect()
        const body = await request.json()

        if (typeof body !== "object" || body === null || Array.isArray(body)) {
            return NextResponse.json(
                { error: "Body must be a JSON object, like { \"products\": [ ... ] }" },
                { status: 400 }
            );
        }

        const workspaceId = randomBytes(4).toString("hex");

        const docs = [];

        for (const [resource, items] of Object.entries(body)) {
            if (!Array.isArray(items)) {
                    return NextResponse.json(
                    { error: `"${resource}" must be an array` },
                    { status: 400 }
                );
            }
            for (const item of items) {
                docs.push({ workspaceId, resource, data: item });
            }
        }

        if (docs.length === 0) {
            return NextResponse.json(
                { error: "Add at least one record to create a workspace" },
                { status: 400 }
            );
        }

        await MockRecord.insertMany(docs)
        const endpoints = Object.keys(body).map(
            (resource) => `/api/mock/${workspaceId}/${resource}`
        );

        return NextResponse.json({workspaceId, endpoints}, {status: 201})

    }catch(error){
        return NextResponse.json({error: error.message}, {status: 500})
    }

}