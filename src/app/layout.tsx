import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { CartProvider } from "@/components/orders/CartProvider";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "ShopEase Demo",
  description: "Demo-Projekt: Automatisierte Teststrategie mit CI/CD-Pipeline",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased min-h-screen bg-white text-zinc-900">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
              {children}
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

