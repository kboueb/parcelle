import { prisma } from "@/lib/prisma"
import { ListingStatus } from "@prisma/client"
import { notFound } from "next/navigation"
import { ListingCard } from "@/components/public/ListingCard"
import { LAND_TYPE_LABELS } from "@/lib/constants"
import { serializeListings } from "@/lib/serialize"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ slug: string }>
}

const slugToLandType: Record<string, string> = {
  "terrain-constructible": "BUILDABLE",
  "terrain-viabilise": "SERVICED",
  "terrain-agricole": "AGRICULTURAL",
  "terrain-forestier": "FOREST",
  "lotissement": "SUBDIVISION",
  "non-constructible": "NON_BUILDABLE",
  "commercial": "COMMERCIAL",
  "industriel": "INDUSTRIAL",
  "rural": "RURAL",
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const landTypeValue = slugToLandType[slug]
  if (!landTypeValue) return {}
  const label = LAND_TYPE_LABELS[landTypeValue] || slug
  return {
    title: `${label} à vendre - Annonces de terrains`,
    description: `Retrouvez toutes nos annonces de ${label.toLowerCase()} à vendre en France. Consultez les prix, surfaces et localisations.`,
  }
}

export default async function TerrainTypePage({ params }: Props) {
  const { slug } = await params
  const landTypeValue = slugToLandType[slug]
  if (!landTypeValue) notFound()

  const label = LAND_TYPE_LABELS[landTypeValue] || slug
  const listings = await prisma.listing.findMany({
    where: { status: ListingStatus.PUBLISHED, landType: landTypeValue as any },
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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{label} à vendre</h1>
        <p className="text-gray-500 mt-2">
          {listings.length} annonce{listings.length > 1 ? "s" : ""} de {label.toLowerCase()} disponible{listings.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {serializedListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing as any} />
        ))}
        {listings.length === 0 && (
          <div className="col-span-full text-center py-16">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune annonce disponible</h3>
            <p className="text-gray-500">Revenez bientôt ou explorez d&apos;autres types de terrains</p>
          </div>
        )}
      </div>
    </div>
  )
}
