import Subtext from "@/components/general/Subtext";

export default function PrivacyPage() {
    return (
        <main className="md:m-20 m-2 md:p-10 p-3 rounded-lg border border-bg-lighter">
            <h1>Privacy Policy</h1>
            <Subtext>Last updated September 1st, 2024</Subtext>
            <p>This is the legal stuff I need to say so I don't get sued.</p>
            <h2>Transparency</h2>
            <p className="whitespace-pre-wrap">
                Your IP is stored with Cloudflare for analytics purposes only. Your data is not used for any other purpose.
                Your IP is also not linked back to you; it is stored completely standalone.
                Your IP is never shared with anyone, unless I am required by law to do so.
                Analytics are available to the public, <a href="/analytics/" className="text-primary">here</a>.
                Your IP is not sold or sent to anyone else in any way, shape, or form.
                Most websites track your IP for the same reason, or different reasons, and this is no different.
            </p>
            <h2>Retention</h2>
            <p className="whitespace-pre-wrap">
                Your IP will only be stored for 30 days. This resets everytime you visit the website.

                If you have not visited the website for 30 or more days, your IP will no longer be stored
            </p>
            <h2>Security</h2>
            <p className="whitespace-pre-wrap">
                Your IP is stored within Cloudflare, and is locked behind account authentication.
                Your IP is encrypted with a secret key that is not available to the public in any way, even if someone got into my Cloudflare account.
                Your IP is also never sent to your client, and is deleted on the server.

                If you so wish, you can view this website's entire source code, including analytics, <a href="https://github.com/MrDiamondDog/website" className="text-primary">here</a>.
            </p>
            <h2>Updates</h2>
            <p className="whitespace-pre-wrap">
                If this Privacy Policy is ever updated, there will be a large notice on all pages of the website.
            </p>
            <h2>Consent</h2>
            <p className="whitespace-pre-wrap">
                By visiting or using this website, you consent to this Privacy Policy.
            </p>
        </main>
    );
}
