import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SecurityTrustBar from "@/components/sections/SecurityTrustBar";
import CartDrawer from "@/components/cart/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import { ProductProvider } from "@/context/ProductContext";
import { MessageCircle } from "lucide-react";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant-garamond",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AURA | Moissanite Solitaire Rings & Fine Jewelry",
  description: "Discover certified VVS1 D-Color Moissanite solitaire rings, eternity bands, and bespoke fine jewelry. 100% Lifetime Buyback, GRA certified, and free insured delivery across India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} overflow-x-hidden max-w-full`}>
      <body className="min-h-screen flex flex-col font-sans bg-[#FDFBF7] text-[#18181B] selection:bg-[#D4AF37] selection:text-white antialiased overflow-x-hidden max-w-full w-full">
        <ProductProvider>
          <CartProvider>
            <Header />
            <CartDrawer />
            <main className="flex-grow pt-[84px] md:pt-[112px] overflow-x-hidden w-full max-w-full">
              {children}
            </main>
            <SecurityTrustBar />
            <Footer />

            {/* Floating WhatsApp Support Widget - responsive sizing */}
            <a
              href="https://wa.me/919999999999?text=Hello%20AURA%20Jewelry%20Team!%20I%20would%20like%20to%20inquire%20about%20a%20Moissanite%20Ring."
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-[#064E3B] hover:bg-[#043327] text-[#D4AF37] hover:text-white p-3 sm:p-3.5 rounded-full shadow-2xl border border-[#D4AF37]/50 flex items-center justify-center transition-all duration-300 hover:scale-110 group cursor-pointer"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
              <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 ease-in-out font-sans text-xs font-bold uppercase tracking-wider pl-0 group-hover:pl-2">
                Chat on WhatsApp
              </span>
            </a>
          </CartProvider>
        </ProductProvider>
      </body>
    </html>
  );
}
