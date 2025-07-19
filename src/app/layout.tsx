import { Orbitron } from "next/font/google";
import "./globals.css";
const orbitron = Orbitron({ subsets: ["latin"], weight: "600" });
import { Toaster } from 'react-hot-toast'
import { Sidebar } from "lucide-react";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Nexus Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href={`https://fonts.googleapis.com/css2?family=Orbitron:wght@600&display=swap`} rel="stylesheet" />
      </head>
    <body className={`${orbitron.className} bg-background text-white`}>
      <div className="min-h-screen bg-background text-white flex flex-col">
        <main className="flex-1 p-6">{children}</main>
        <Toaster position="top-left" />
        <footer className="text-center text-glow">Nexus Club © 2025</footer>
      </div>
    </body>
    </html>
  );
}
