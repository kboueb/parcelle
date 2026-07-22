import { prisma } from "@/lib/prisma"
import { ListingStatus } from "@prisma/client"
import { notFound } from "next/navigation"
import { ListingCard } from "@/components/public/ListingCard"
import { serializeListings } from "@/lib/serialize"
import { getSiteName } from "@/lib/site-name"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: Props) {
  const { code } = await params
  const name = await getSiteName()
  return {
    title: `Terrain à vendre dans le ${code} - ${name}`,
    description: `Consultez les annonces de terrains dans le département ${code}.`,
  }
}

export default async function DepartmentPage({ params }: Props) {
  const { code } = await params

  const listings = await prisma.listing.findMany({
    where: { status: ListingStatus.PUBLISHED, departmentCode: code },
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
        <h1 className="text-3xl font-bold text-gray-900">
          Terrain à vendre dans le {code} - {listings[0].department}
        </h1>
        <p className="text-gray-500 mt-2">
          {listings.length} annonce{listings.length > 1 ? "s" : ""} dans le département {code}
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
