import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Remarketing from "@/components/marketing/Remarketing";

export const metadata: Metadata = {
  title: {
    default: "ARC LAR – Seu novo endereço está aqui!",
    template: "%s | ARC LAR – Portal Imobiliário Nacional",
  },
  description: "Encontre o imóvel ideal para comprar ou alugar em todo o Brasil. Milhares de casas, apartamentos, terrenos e imóveis comerciais no ARC LAR.",
  keywords: ["imóveis", "apartamentos à venda", "casas à venda", "imóveis para alugar", "portal imobiliário", "ARC LAR", "comprar imóvel", "alugar imóvel"],
  authors: [{ name: "ARC LAR" }],
  creator: "ARC LAR",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://arclar.com.br",
    siteName: "ARC LAR – Portal Imobiliário Nacional",
    title: "ARC LAR – Seu novo endereço está aqui!",
    description: "Encontre o imóvel ideal em todo o Brasil. Compre, alugue ou anuncie com o ARC LAR.",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "ARC LAR" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ARC LAR – Seu novo endereço está aqui!",
    description: "Portal imobiliário nacional. Compre, alugue ou anuncie imóveis em todo o Brasil.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0, fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }}>
        <Header />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
        <Remarketing />
      </body>
    </html>
  );
}
