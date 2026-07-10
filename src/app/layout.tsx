import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SwarmOS — The Operating System for Autonomous Space Infrastructure",
  description:
    "When satellites stop waiting for commands and start protecting each other. A decentralized swarm intelligence platform for the autonomous orbital economy of 2055.",
  keywords: [
    "SwarmOS",
    "satellite swarm",
    "autonomous space",
    "collision avoidance",
    "decentralized AI",
    "orbital intelligence",
    "peer-to-peer satellites",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
