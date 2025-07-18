import "./globals.css";

import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import { Toaster } from "sonner";

import Analytics from "@/components/general/Analytics";

const font = Lexend({
    weight: "400",
    display: "swap",
    subsets: ["latin-ext"],
});

export const metadata: Metadata = {
    title: "mrdiamond.is-a.dev",
    description: "you should go to this website",
    icons: [
        "/images/avatar.webp",
    ],
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
            <body className={`bg-bg ${font.className}`}>
                {children}
                <Toaster richColors theme="dark" />
            </body>
        </html>
    );
}
