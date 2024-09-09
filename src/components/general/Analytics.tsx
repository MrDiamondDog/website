import Script from "next/script";

export default function Analytics() {
    return (<>
        <Script defer src="ttps://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon={`{"token": "${process.env.CF_ANALYTICS_TOKEN}"}`}></Script>
    </>);
}
