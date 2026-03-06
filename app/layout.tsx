import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Drawing notes app",
  description: "Draw notes like a whiteboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
