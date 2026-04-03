import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Karaoke Map Wisconsin",
  description: "Find karaoke events around Wisconsin."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main className="mx-auto w-full max-w-3xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
