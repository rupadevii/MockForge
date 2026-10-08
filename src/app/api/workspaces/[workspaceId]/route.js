import dbConnect from "@/lib/dbConnect";
import { MockRecord } from "@/models/MockRecord";
import { NextResponse } from "next/server";

export async function GET(request, {params}){
    try{
        const {workspaceId} = await params

        await dbConnect()

        const resources = await MockRecord.distinct("resource", {workspaceId})

        if(resources.length===0){
            return NextResponse.json({error: "Workspace not found"}, {status: 404})
        }

        return NextResponse.json({workspaceId, resources})
    }catch(error){
        return NextResponse.json({error: error.message}, {status: 500})
    }
}