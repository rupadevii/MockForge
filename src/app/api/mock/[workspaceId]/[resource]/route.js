import dbConnect from "@/lib/dbConnect";
import { formatRecord } from "@/lib/formatRecord";
import { MockRecord } from "@/models/MockRecord";
import { NextResponse } from "next/server";

export async function OPTIONS() {
    return new Response(null, { status: 204 });
}

export async function GET(request, {params}){
    try{
        const {workspaceId, resource} = await params
        const {searchParams} = new URL(request.url)

        const filter = { workspaceId, resource}

        let sortOrder = {createdAt: 1}

        const sort = searchParams.get("_sort")

        const order = searchParams.get("_order")

        let page = parseInt(searchParams.get("_page"), 10)
        let limit = parseInt(searchParams.get("_limit"), 10)

        if(!page || page<1) page = 1
        if(!limit || limit >100 || limit<1) limit = 100

        const skip = (page-1) * limit

        if(sort && !sort.startsWith("$") && !sort.includes(".")){
            sortOrder = {["data." + sort] : order==="desc" ? -1 : 1}
        }
        
        for(const [key, value] of searchParams.entries()){
            if(key.startsWith("_") || key.startsWith("$") || key.includes(".")) continue
            
            const list = [value]
            if(value !== "" && !Number.isNaN(Number(value))){
                list.push(Number(value))
            }

            if(value==="true" || value==="false") list.push(value==="true")

            filter["data."+key] = { $in : list}
        }

        await dbConnect()
        const records = await MockRecord.find(filter).sort({...sortOrder, _id: 1}).skip(skip).limit(limit)

        return NextResponse.json(records.map(formatRecord))
    }catch(error){
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

export async function POST(request, {params}){
    const {workspaceId, resource} = await params
    
    try{
        const body = await request.json()
        await dbConnect()
        const newRecord = await MockRecord.create({workspaceId, resource, data: body})
        return NextResponse.json(formatRecord(newRecord), {status: 201})
    }catch(error){
        return NextResponse.json({error: error.message}, {status: 500})
    }
}