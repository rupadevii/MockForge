/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    reactCompiler: true,
    async headers(){
        return [
            {
                source: "/api/mock/:path*",
                headers: [
                    {key: "Access-Control-Allow-Origin", value: "*"},
                    {key: "Access-Control-Allow-Methods",value: "GET,POST,PUT,DELETE,OPTIONS"},
                    {key: "Access-Control-Allow-Headers", value: "Content-Type"}
                ]
            }
        ]
    }
};

export default nextConfig;
