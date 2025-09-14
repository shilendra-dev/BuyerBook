import type { Metadata } from "next";
import "./globals.css";
import { ClientToaster } from "@/ui/organisms/ClientToaster";

export const metadata: Metadata = {
  title: "BuyerBook",
  description: "Buyer Lead Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <ClientToaster />
        {children}
      </body>
    </html>
  );
}
