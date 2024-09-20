import "./globals.css";

import { AptabaseProvider } from "@aptabase/react";
import type { Metadata } from "next";
import { Rethink_Sans } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "sonner";

import Analytics from "@/components/general/Analytics";
import DiscordOAuth from "@/components/general/DiscordOAuth";


// const font = Mukta({
//   weight: "400",
//   display: "swap",
//   subsets: ["latin-ext"],
// });
// const font = Dosis({
//   weight: "400",
//   display: "swap",
//   subsets: ["latin-ext"],
// });
// const font = Oxygen({
//   weight: "400",
//   display: "swap",
//   subsets: ["latin-ext"],
// });
// const font = Red_Hat_Display({
//   weight: "400",
//   display: "swap",
//   subsets: ["latin-ext"],
// });
// const font = Schibsted_Grotesk({
//   weight: "400",
//   display: "swap",
//   subsets: ["latin-ext"],
// });
const font = Rethink_Sans({
    weight: "400",
    display: "swap",
    subsets: ["latin-ext"],
});

export const metadata: Metadata = {
    title: "mrdiamond.is-a.dev",
    description: "you should go to this website",
    icons: [
        "/images/avatar.webp"
    ]
};

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <Toaster richColors theme="dark" />
            <Suspense><DiscordOAuth /></Suspense>
            <body className={"bg-bg " + font.className}>
                <AptabaseProvider appKey="A-US-4621789518">
                    <Analytics />
                    {children}
                </AptabaseProvider>
            </body>
        </html>
    );
}
