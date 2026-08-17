import "./globals.css";

import { CheckCircle2, CircleAlert, Info } from "lucide-react";
import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Drew Rat",
  description: "Drew Rat",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
		<body className="bg-bg h-screen">
			{children}

			<Toaster
				className="toaster group"
				theme="dark"
				richColors
				style={{
					"--normal-bg": "var(--color-surface0)",
					"--normal-text": "white",
					"--normal-border": "var(--color-surface1)",
				} as React.CSSProperties}
				visibleToasts={5}
				icons={{
					success: <CheckCircle2 size={20} />,
					error: <CircleAlert size={20} />,
					info: <Info size={20} />,
				}}
			/>

			<div id="portal-root" />
		</body>
    </html>
  );
}
