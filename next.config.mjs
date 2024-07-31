/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: async function() {
        return [
            {
                source: "/blog",
                destination: "/",
                permanent: true
            }
        ];
    }
};

export default nextConfig;
