import { Orbitron } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
const orbitron = Orbitron({ subsets: ["latin"], weight: "600" });

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Nexus Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className={`${orbitron.className} bg-background text-white`}>
        <div className="min-h-screen bg-background text-white flex flex-col">
          <main className="flex-1 p-6">{children}</main>
        </div>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
