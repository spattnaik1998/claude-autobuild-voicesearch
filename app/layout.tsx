import type { Metadata } from "next";
import "./globals.css";
import { RootLayoutClient } from "./RootLayoutClient";

export const metadata: Metadata = {
  title: "VoiceSearch Insights",
  description: "Search, Summarize, Listen - Get AI-powered audio summaries of any topic",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
