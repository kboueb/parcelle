import { prisma } from "@/lib/prisma"
import Link from "next/link"

export async function BannerHero() {
  const now = new Date()

  const banner = await prisma.banner.findFirst({
    where: {
      isActive: true,
      OR: [
        { startAt: null, endAt: null },
        { startAt: null, endAt: { gte: now } },
        { startAt: { lte: now }, endAt: null },
        { startAt: { lte: now }, endAt: { gte: now } },
      ],
    },
    orderBy: { order: "asc" },
  })

  if (!banner) return null

  const content = (
    <div
      className="relative overflow-hidden bg-gradient-to-r from-emerald-700 to-emerald-900 text-white"
    >
      {banner.imageUrl && (
        <div className="absolute inset-0">
          <img src={banner.imageUrl} alt="" className="h-full w-full object-cover opacity-20" />
        </div>
      )}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-1">{banner.title}</h2>
        {banner.subtitle && (
          <p className="text-emerald-100 text-sm md:text-base">{banner.subtitle}</p>
        )}
        {banner.linkUrl && (
          <Link
            href={banner.linkUrl}
            className="inline-block mt-3 px-5 py-2 bg-white text-emerald-800 text-sm font-semibold rounded-lg hover:bg-emerald-50 transition-colors"
          >
            En savoir plus
          </Link>
        )}
      </div>
    </div>
  )

  if (banner.linkUrl && !banner.linkUrl.startsWith("http")) {
    return <Link href={banner.linkUrl}>{content}</Link>
  }

  return content
}
