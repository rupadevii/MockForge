"use client"
import { useState } from 'react'

export default function DashboardPage() {
    const [json, setJson] = useState("")
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)

    async function handleCreate(e) {
        e.preventDefault()
        try {
            setError(null)
            setLoading(true)

            JSON.parse(json)

            const res = await fetch('/api/workspaces', {
                method: "POST", 
                headers: {"Content-Type": "application/json"},
                body: json
            })
            const data = await res.json()

            if(!res.ok){
                setError(data.error)
            }else{
                setResult(data)
            }
            
        } catch(err) {
            if(err instanceof SyntaxError){
                setError("That isn't valid json")
            }else{
                setError(err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-neutral-900 text-neutral-100 font-sans p-8 md:p-16 flex justify-center">
            <div className="w-full max-w-xl space-y-6">
                
                <div className="border-b border-neutral-800 pb-4">
                    <h1 className="text-lg font-medium text-neutral-200">Create Workspace API</h1>
                    <p className="text-sm text-neutral-400 mt-1">Provide your JSON payload to generate endpoints.</p>
                </div>

                <form onSubmit={handleCreate} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-neutral-400">
                            JSON Payload
                        </label>
                        <textarea 
                            rows={6}
                            placeholder='{"products":[{"name": "Shoe"}]}' 
                            value={json} 
                            onChange={(e) => setJson(e.target.value)}
                            className="w-full font-mono text-sm bg-neutral-950 border border-neutral-800 rounded-md p-3 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors resize-y"
                        />
                    </div>

                    <button 
                        type="submit" 
                        onClick={handleCreate} 
                        disabled={loading}
                        className="w-full py-2.5 px-4 bg-neutral-100 hover:bg-white active:bg-neutral-200 text-neutral-900 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating..." : "Create API"}
                    </button>

                    {error && (
                        <p className="text-sm text-red-400 font-mono mt-2">{error}</p>
                    )}
                </form>

                {result && (
                    <div className="pt-6 border-t border-neutral-800 space-y-3">
                        <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Endpoints</h2>
                        <ul className="space-y-2 font-mono text-xs">
                            {result.endpoints.map((endpoint) => (
                                <li key={endpoint} className="p-3 bg-neutral-950 border border-neutral-800 rounded-md text-neutral-300 break-all">
                                    {window.location.origin + endpoint}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </main>
    )
}