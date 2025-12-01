import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Modern E-Commerce Store",
  description: "A sleek and interactive e-commerce platform",
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

