/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: async function() {
        return [
            {
                source: "/blog",
                destination: "/",
                permanent: true
            },
            {
                source: "/posts/:slug/:file",
                destination: "/blog/:slug",
                permanent: true
            }
        ];
    }
};

export default nextConfig;
