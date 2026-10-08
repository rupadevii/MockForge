"use client"
import { useParams } from "next/navigation";
import { useState, useEffect } from "react"

function display(value){
    if(value === undefined || value === null) return ""

    if(typeof value === "object") return JSON.stringify(value)
    return String(value) 
}

export default function WorkspacePage(){
    const [resources, setResources] = useState([])
    const [selected, setSelected] = useState(null)
    const [records, setRecords] = useState([])
    const [error, setError] = useState(null)
    const {workspaceId} = useParams()

    useEffect(() => {
        async function loadWorkspaces(){
            try{
                const res = await fetch(`/api/workspaces/${workspaceId}`)
                const data = await res.json()
                if(!res.ok){
                    setError(data.error)
                }
                else{
                    setResources(data.resources)
                    setSelected(data.resources[0])
                }
            }catch(err){
                setError(err.message)
            }
        }
        loadWorkspaces()
    }, [workspaceId])

    useEffect(() => {
        if(!selected) return
        async function loadRecords(){
            try {
                const res = await fetch(`/api/mock/${workspaceId}/${selected}`)
                const data = await res.json()
                if(!res.ok){
                    setError(data.error)
                }
                else{
                    setRecords(data)
                }
            } catch (err) {
                setError(err.message)
            }
        }
        loadRecords()
    }, [workspaceId, selected])

    const columns = ["id", ...new Set(records.flatMap((r) => Object.keys(r)).filter((item) => item !== "id"))]

    return (
        <main className="min-h-screen bg-neutral-900 text-neutral-100 font-sans p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-6">
                
                <div className="border-b border-neutral-800 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-medium text-neutral-200">Workspace Dashboard</h1>
                        <p className="text-xs text-neutral-500 font-mono mt-0.5">ID: {workspaceId}</p>
                    </div>
                </div>

                {error ? (
                    <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-md">
                        <p className="text-sm text-red-400 font-mono">{error}</p>
                    </div>
                ) : (
                    <section className="space-y-6">
                        
                        <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-4">
                            {resources.map(resource => {
                                const isSelected = resource === selected;
                                return (
                                    <button 
                                        key={resource} 
                                        onClick={() => setSelected(resource)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                            isSelected 
                                                ? "bg-neutral-100 text-neutral-900" 
                                                : "bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700"
                                        }`}
                                    >
                                        {resource}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="bg-neutral-950 border border-neutral-800 rounded-md overflow-hidden">
                            {records.length === 0 ? (
                                <div className="p-8 text-center">
                                    <p className="text-sm text-neutral-500">No records in this resource</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                            <tr className="border-b border-neutral-800 bg-neutral-900/50">
                                                {columns.map(col => (
                                                    <th key={col} className="p-3 font-medium text-neutral-400 uppercase tracking-wider">
                                                        {col}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-800/60 font-mono">
                                            {records.map((record => (
                                                <tr key={record.id} className="hover:bg-neutral-900/40 transition-colors">
                                                    {columns.map(col => (
                                                        <td key={col} className="p-3 text-neutral-300 max-w-xs truncate">
                                                            {display(record[col])}
                                                        </td>
                                                    ))}
                                                </tr>
                                            )))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </div>
        </main>
    )
}