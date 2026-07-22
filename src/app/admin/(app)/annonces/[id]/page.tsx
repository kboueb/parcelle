import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { serializeListing } from "@/lib/serialize"
import { AdminListingForm } from "@/components/admin/AdminListingForm"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ id: string }>
}

export default async function AdminListingEditPage({ params }: Props) {
  const { id } = await params

  if (id === "nouveau") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nouvelle annonce</h2>
          <p className="text-gray-500 mt-1">Créez une nouvelle annonce</p>
        </div>
        <AdminListingForm />
      </div>
    )
  }

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { images: true, documents: true, category: true, seoMetadata: true },
  })

  if (!listing) notFound()

  const serializedListing = serializeListing(listing)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Modifier l&apos;annonce</h2>
        <p className="text-gray-500 mt-1">{listing.title} · {listing.city}</p>
      </div>
      <AdminListingForm listing={serializedListing as any} />
    </div>
  )
}
