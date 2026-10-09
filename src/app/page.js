"use client"
import Link from 'next/link';
import { useState } from 'react'

const exampleJson = `{
    "products": [
        { "name": "Running Shoe", "price": 2499, "inStock": true },
        { "name": "Backpack", "price": 1299, "inStock": false }
    ],
    "users": [
        { "name": "Asha", "email": "asha@example.com" }
    ]
}`

const methods = [
    { call: "GET /products", description: "List all records" },
    { call: "POST /products", description: "Add a record" },
    { call: "GET /products/:id", description: "Get one record" },
    { call: "PUT /products/:id", description: "Replace a record" },
    { call: "DELETE /products/:id", description: "Delete a record" },
]

const urlOptions = [
    { example: "?category=shoes", description: "Filter by any field" },
    { example: "?_sort=price&_order=desc", description: "Sort by a field, add _order=desc for descending" },
    { example: "?_page=2&_limit=5", description: "Get one page of results (up to 100 per request)" },
    { example: "?_delay=2000", description: "Wait before responding, in milliseconds (up to 5000)" },
    { example: "?_status=500", description: "Return an error status, from 400 to 599" },
]

export default function Home() {
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
        <main className="min-h-screen bg-neutral-900 text-neutral-100 font-sans p-6 md:p-16 flex flex-col items-center">
            <div className="w-full max-w-2xl space-y-12">
                
                <div className="text-center space-y-2">
                    <h1 className="text-xl font-medium text-neutral-100 tracking-tight">From JSON to REST API in Seconds</h1>
                    <p className="text-sm text-neutral-400">Instantly generate mock REST endpoints from any JSON payload.</p>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 md:p-8 space-y-6 shadow-2xl">
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
                                className="w-full font-mono text-xs bg-neutral-900 border border-neutral-800 rounded-md p-3 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors resize-y"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-2.5 px-4 bg-neutral-100 hover:bg-white active:bg-neutral-200 text-neutral-900 text-xs font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating..." : "Create API"}
                        </button>

                        {error && (
                            <p className="text-xs text-red-400 font-mono mt-2">{error}</p>
                        )}
                    </form>

                    {result && (
                        <div className="pt-6 border-t border-neutral-800 space-y-4 animate-in fade-in duration-200">
                            <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Endpoints</h2>
                            <ul className="space-y-2 font-mono text-xs">
                                {result.endpoints.map((endpoint) => (
                                    <li key={endpoint} className="p-3 bg-neutral-900 border border-neutral-800 rounded-md text-neutral-300 break-all">
                                        {window.location.origin + endpoint}
                                    </li>
                                ))}
                            </ul>
                            <div>
                                <Link 
                                    href={`/workspace/${result.workspaceId}`}
                                    className="inline-flex items-center justify-center w-full py-2.5 px-4 bg-neutral-100 hover:bg-white text-neutral-900 text-xs font-medium rounded-md transition-colors"
                                >
                                    Open Workspace →
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                <section className="bg-neutral-950/50 border border-neutral-800/80 rounded-lg p-6 md:p-8 space-y-8 text-sm">
                    <div className="border-b border-neutral-800 pb-4">
                        <h2 className="text-sm font-medium text-neutral-200">How to use</h2>
                    </div>

                    <ol className="list-decimal pl-5 space-y-5 text-neutral-400 marker:text-neutral-600">
                        <li>
                            <span className="text-neutral-300">Paste a JSON object.</span> Each key becomes a resource, and its array holds the records.
                            <pre className="mt-3 p-3 bg-neutral-900 border border-neutral-800 rounded-md font-mono text-xs text-neutral-300 overflow-x-auto">{exampleJson}</pre>
                        </li>
                        <li>
                            <span className="text-neutral-300">Click Create API.</span> You get one URL per resource, and a workspace page where you can browse and delete your data.
                        </li>
                        <li>
                            <span className="text-neutral-300">Call the URLs from your app.</span> Add these to a URL, using your own resource name in place of products:
                            <ul className="mt-3 space-y-2">
                                {methods.map((item) => (
                                    <li key={item.call} className="flex flex-col sm:flex-row sm:gap-4 text-xs bg-neutral-900/60 p-2.5 rounded border border-neutral-800/60">
                                        <code className="font-mono text-neutral-200 sm:w-40 shrink-0">{item.call}</code>
                                        <span className="text-neutral-400">{item.description}</span>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </ol>

                    <div className="space-y-3 pt-4 border-t border-neutral-800">
                        <h3 className="text-xs font-medium text-neutral-300 uppercase tracking-wider">Options you can add to any URL</h3>
                        <ul className="space-y-2">
                            {urlOptions.map((option) => (
                                <li key={option.example} className="flex flex-col sm:flex-row sm:gap-4 text-xs bg-neutral-900/60 p-2.5 rounded border border-neutral-800/60">
                                    <code className="font-mono text-neutral-200 sm:w-52 shrink-0">{option.example}</code>
                                    <span className="text-neutral-400">{option.description}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="text-xs text-neutral-500 pt-1">You can combine them, for example <code className="font-mono text-neutral-400">?category=shoes&amp;_sort=price&amp;_limit=10</code>.</p>
                    </div>

                    <div className="space-y-2 text-xs text-neutral-500 pt-4 border-t border-neutral-800">
                        <p>• Works from any website, so you can call it straight from your frontend.</p>
                        <p>• This is a shared public sandbox. Anyone with your workspace link can read and change its data, so don&apos;t store anything private.</p>
                        <p>• Requests are limited per visitor. If you see &quot;Too many requests&quot;, wait a moment and try again.</p>
                    </div>
                </section>

            </div>
        </main>
    )
}