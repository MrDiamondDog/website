"use client";

import { toast } from "sonner";

export default function Copyable({ text, className, children }: Readonly<{ text: string; className: string, children: React.ReactNode }>) {
  return (
    <a href="#" onClick={() => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    }} className={className}>{children}</a>
  );
}