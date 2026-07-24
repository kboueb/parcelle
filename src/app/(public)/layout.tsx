import { Header } from "@/components/public/Header"
export const dynamic = "force-dynamic"
import { Footer } from "@/components/public/Footer"
import { BannerHero } from "@/components/public/BannerHero"
import { getSiteName } from "@/lib/site-name"

export const dynamic = "force-dynamic"

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const siteName = await getSiteName()
  return (
    <div className="flex min-h-screen flex-col">
      <Header siteName={siteName} />
      <BannerHero />
      <main className="flex-1">{children}</main>
      <Footer siteName={siteName} />
    </div>
  )
}
