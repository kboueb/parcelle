import { prisma } from "@/lib/prisma"
import { ListingStatus } from "@prisma/client"
import { notFound } from "next/navigation"
import { ListingCard } from "@/components/public/ListingCard"
import { serializeListings } from "@/lib/serialize"
import { getSiteName } from "@/lib/site-name"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const city = slug.charAt(0).toUpperCase() + slug.slice(1)
  const name = await getSiteName()
  return {
    title: `Terrain à vendre ${city} - ${name}`,
    description: `Consultez les annonces de terrains et parcelles à ${city}. Trouvez le terrain idéal pour votre projet.`,
  }
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params
  const cityName = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ")

  const listings = await prisma.listing.findMany({
    where: {
      status: ListingStatus.PUBLISHED,
      city: { contains: cityName, mode: "insensitive" },
    },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true, title: true, slug: true, price: true, surface: true,
      pricePerSqm: true, landType: true, listingType: true, city: true,
      department: true, postalCode: true, latitude: true, longitude: true,
      isFeatured: true, isUrgent: true, isExclusive: true, publishedAt: true,
      images: { select: { url: true, thumbnailUrl: true, isPrimary: true }, orderBy: { order: "asc" } },
      category: { select: { name: true, slug: true } },
    },
  })
  const serializedListings = serializeListings(listings)

  if (listings.length === 0) notFound()

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Terrain à vendre {cityName}</h1>
        <p className="text-gray-500 mt-2">
          {listings.length} annonce{listings.length > 1 ? "s" : ""} de terrain à {cityName}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {serializedListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing as any} />
        ))}
      </div>
    </div>
  )
}
