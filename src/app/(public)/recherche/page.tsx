import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { ListingStatus } from "@prisma/client"
import { notFound } from "next/navigation"
import { FilterSidebar } from "@/components/public/FilterSidebar"
import { ListingCard } from "@/components/public/ListingCard"
import { SearchBar } from "@/components/public/SearchBar"
import { ITEMS_PER_PAGE } from "@/lib/constants"
import { Skeleton } from "@/components/ui/skeleton"
import { serializeListings } from "@/lib/serialize"

export const dynamic = "force-dynamic"

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function SearchResults({ searchParams }: Props) {
  const sp = await searchParams
  const page = Math.max(1, Number(sp.page) || 1)
  const skip = (page - 1) * ITEMS_PER_PAGE

  const where: any = { status: ListingStatus.PUBLISHED }

  const q = sp.q as string | undefined
  const city = sp.city as string | undefined
  const department = sp.department as string | undefined
  const landType = sp.landType as string | undefined
  const listingType = sp.listingType as string | undefined
  const minPrice = sp.minPrice as string | undefined
  const maxPrice = sp.maxPrice as string | undefined
  const minSurface = sp.minSurface as string | undefined
  const maxSurface = sp.maxSurface as string | undefined

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { department: { contains: q, mode: "insensitive" } },
    ]
  }
  if (city) where.city = { contains: city, mode: "insensitive" }
  if (department) where.department = { contains: department, mode: "insensitive" }
  if (landType) where.landType = landType
  if (listingType) where.listingType = listingType
  if (minPrice || maxPrice) {
    where.price = {}
    if (minPrice) where.price.gte = Number(minPrice)
    if (maxPrice) where.price.lte = Number(maxPrice)
  }
  if (minSurface || maxSurface) {
    where.surface = {}
    if (minSurface) where.surface.gte = Number(minSurface)
    if (maxSurface) where.surface.lte = Number(maxSurface)
  }

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip,
      take: ITEMS_PER_PAGE,
      select: {
        id: true, title: true, slug: true, price: true, surface: true,
        pricePerSqm: true, landType: true, listingType: true, city: true,
        department: true, postalCode: true, latitude: true, longitude: true,
        isFeatured: true, isUrgent: true, isExclusive: true, publishedAt: true,
        images: { select: { url: true, thumbnailUrl: true, isPrimary: true }, orderBy: { order: "asc" } },
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.listing.count({ where }),
  ])
  const serializedListings = serializeListings(listings)

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  const getPageUrl = (p: number) => {
    const params = new URLSearchParams(sp as any)
    params.set("page", String(p))
    return `/recherche?${params.toString()}`
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          {total} annonce{total > 1 ? "s" : ""} trouvée{total > 1 ? "s" : ""}
        </p>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune annonce trouvée</h3>
          <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serializedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing as any} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {page > 1 && (
            <a href={getPageUrl(page - 1)} className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">
              Précédent
            </a>
          )}
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const p = i + 1
            return (
              <a
                key={p}
                href={getPageUrl(p)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  p === page
                    ? "bg-emerald-600 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {p}
              </a>
            )
          })}
          {page < totalPages && (
            <a href={getPageUrl(page + 1)} className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">
              Suivant
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default async function SearchPage({ searchParams }: Props) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <SearchBar />
      </div>
      <div className="flex gap-8">
        <aside className="hidden lg:block w-72 shrink-0">
          <FilterSidebar />
        </aside>
        <div className="flex-1 min-w-0">
          <Suspense fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
                  <Skeleton className="aspect-[4/3] rounded-none" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-6 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          }>
            <SearchResults searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
