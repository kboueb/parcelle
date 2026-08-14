import { Header } from "@/components/public/Header"
import { Footer } from "@/components/public/Footer"
import { BannerHero } from "@/components/public/BannerHero"
import { getSiteConfig } from "@/lib/site-config"

export const dynamic = "force-dynamic"

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const config = await getSiteConfig()
  return (
    <div className="flex min-h-screen flex-col">
      <Header
        siteName={config.siteName}
        siteLogoUrl={config.siteLogoUrl}
        headerDisplay={config.headerDisplay}
      />
      <BannerHero />
      <main className="flex-1">{children}</main>
      <Footer siteName={config.siteName} siteLogoUrl={config.siteLogoUrl} />
    </div>
  )
}
