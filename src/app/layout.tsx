import "./globals.css";

import type { Metadata } from "next";
import { Rethink_Sans } from "next/font/google";
import { Toaster } from "sonner";

import Analytics from "@/components/general/Analytics";

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
            {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js" async /> */}
            <Analytics />
            <Toaster richColors theme="dark" />
            <body className={"bg-bg " + font.className}>
                {children}
            </body>
        </html>
    );
}
