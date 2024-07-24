import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Dosis, Mukta, Oxygen, Red_Hat_Display, Rethink_Sans, Schibsted_Grotesk } from "next/font/google";

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
    "/avatar.webp"
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
      <body className={"bg-bg " + font.className}>{children}</body>
    </html>
  );
}
