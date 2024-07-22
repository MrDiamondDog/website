import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "mrdiamond.is-a.dev",
  description: "website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Toaster richColors theme="dark" />
      <body className="bg-bg">{children}</body>
    </html>
  );
}
