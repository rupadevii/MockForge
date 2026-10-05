import dbConnect from "@/lib/dbConnect";
import { formatRecord } from "@/lib/formatRecord";
import { MockRecord } from "@/models/MockRecord";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, {params}){
    try{
        await dbConnect()
        const {workspaceId, resource, id} = await params

        if (!mongoose.isValidObjectId(id)) {
            return NextResponse.json({ error: "Invalid id" }, { status: 400 });
        }

        const record = await MockRecord.findOne({workspaceId, resource, _id: id})
        if(!record){
            return NextResponse.json({msg: "Not found"}, {status: 404})
        }
        return NextResponse.json(formatRecord(record))
    }catch(error){
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export async function PUT(request, {params}){
    try{
        await dbConnect()
        const {workspaceId, resource, id} = await params
        const body = await request.json()

        if (!mongoose.isValidObjectId(id)) {
            return NextResponse.json({ error: "Invalid id" }, { status: 400 });
        }

        const updated = await MockRecord.findOneAndUpdate({workspaceId, resource, _id: id}, {data: body}, {new: true})
        if(!updated){
            return NextResponse.json({msg: "Record not found"}, {status: 404})
        }
        return NextResponse.json(formatRecord(updated))
    }catch(error){
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export async function DELETE(request, {params}){
    try{
        await dbConnect()
        const {workspaceId, resource, id} = await params

        if (!mongoose.isValidObjectId(id)) {
            return NextResponse.json({ error: "Invalid id" }, { status: 400 });
        }

        const record = await MockRecord.findOneAndDelete({workspaceId, resource, _id: id})
        if(!record){
            return NextResponse.json({msg: "Record Not found"}, {status: 404})
        }
        return NextResponse.json(formatRecord(record))
    }catch(error){
        return NextResponse.json({error: error.message}, {status: 500})
    }
}