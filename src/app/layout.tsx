import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { getSiteName } from "@/lib/site-name"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export async function generateMetadata(): Promise<Metadata> {
  const name = await getSiteName()
  return {
    title: {
      default: `${name} - Terrains et parcelles à vendre`,
      template: `%s | ${name}`,
    },
    description: "La plateforme de référence pour l'achat et la location de terrains et parcelles.",
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: name,
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white text-gray-900`}>
        {children}
      </body>
    </html>
  )
}
