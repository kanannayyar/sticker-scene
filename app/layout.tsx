import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sticker Scene",
  description: "A cozy browser sticker-book room game.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f9dfc8]">{children}</body>
    </html>
  );
}
