import dbConnect from "@/lib/dbConnect";
import { MockRecord } from "@/models/MockRecord";
import { NextResponse } from "next/server";

export async function GET(request, {params}){
    const {workspaceId, resource} = await params
    try{
        await dbConnect()
        const records = await MockRecord.find({workspaceId, resource})
        return NextResponse.json(records)
    }catch(error){
        return NextResponse.json({error:"Something went wrong"}, {status: 500})
    }
}

export async function POST(request, {params}){
    const {workspaceId, resource} = await params
    
    try{
        const body = await request.json()
        await dbConnect()
        const newRecord = await MockRecord.create({workspaceId, resource, data: body})
        return NextResponse.json({newRecord}, {status: 201})
    }catch(error){
        return NextResponse.json({error: error.message}, {status: 500})
    }
}