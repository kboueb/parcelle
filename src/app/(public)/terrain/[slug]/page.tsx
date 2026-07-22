import { prisma } from "@/lib/prisma"
import { ListingStatus } from "@prisma/client"
import { notFound } from "next/navigation"
import { formatPrice, formatSurface } from "@/lib/utils"
import { LAND_TYPE_LABELS } from "@/lib/constants"
import { getSiteName } from "@/lib/site-name"
import { Badge } from "@/components/ui/badge"
import { serializeListing } from "@/lib/serialize"
import { Separator } from "@/components/ui/separator"
import { ContactForm } from "@/components/public/ContactForm"
import { FavoriteButton } from "@/components/public/FavoriteButton"
import { MapPin, Maximize2, Ruler, Euro, TreePine, Zap, Droplets, Road, Home, Fence, Mountain } from "lucide-react"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const listing = await prisma.listing.findFirst({
    where: { slug, status: ListingStatus.PUBLISHED },
    select: { title: true, description: true, city: true, department: true },
  })
  if (!listing) return {}
  return {
    title: `${listing.title} - ${listing.city} (${listing.department})`,
    description: listing.description.substring(0, 160),
  }
}

export default async function ListingDetailPage({ params }: Props) {
  const { slug } = await params
  let listing: any = await prisma.listing.findFirst({
    where: { slug, status: ListingStatus.PUBLISHED },
    include: {
      images: { orderBy: { order: "asc" } },
      documents: true,
      category: true,
      seoMetadata: true,
    },
  })

  if (!listing) notFound()

  const features = [
    { label: "Viabilisé", value: listing.isServiced, icon: Zap },
    { label: "Constructible", value: listing.isBuildable, icon: Home },
    { label: "Clôturé", value: listing.isFenced, icon: Fence },
    { label: "Accès à l'eau", value: listing.hasWaterAccess, icon: Droplets },
    { label: "Électricité", value: listing.hasElectricity, icon: Zap },
    { label: "Accès routier", value: listing.hasRoadAccess, icon: Road },
    { label: "Terrain plat", value: listing.isFlat, icon: Mountain },
  ]

  listing = serializeListing(listing)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            {listing.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
                <div className="aspect-[4/3] bg-gray-100 col-span-2">
                  <img
                    src={listing.images[0].url}
                    alt={listing.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                {listing.images.slice(1, 5).map((img: any) => (
                  <div key={img.id} className="aspect-[4/3] bg-gray-100">
                    <img src={img.url} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              {listing.isFeatured && <Badge variant="primary">En avant</Badge>}
              {listing.isUrgent && <Badge variant="destructive">Urgent</Badge>}
              {listing.isExclusive && <Badge variant="secondary">Exclusif</Badge>}
              <Badge variant="outline">{LAND_TYPE_LABELS[listing.landType]}</Badge>
              {listing.listingType === "RENT" && <Badge>Location</Badge>}
              <div className="ml-auto">
                <FavoriteButton listingId={listing.id} size="md" />
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{listing.title}</h1>
            <div className="flex items-center gap-2 text-gray-500 mb-4">
              <MapPin className="h-5 w-5" />
              <span>{listing.address}, {listing.postalCode} {listing.city}</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold text-emerald-600">
                {formatPrice(Number(listing.price))}
              </span>
              {listing.pricePerSqm && (
                <span className="text-lg text-gray-400">
                  {formatPrice(Number(listing.pricePerSqm))}/m²
                </span>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <Ruler className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
              <div className="text-lg font-semibold">{formatSurface(Number(listing.surface))}</div>
              <div className="text-xs text-gray-500">Surface</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <Euro className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
              <div className="text-lg font-semibold">{formatPrice(Number(listing.price))}</div>
              <div className="text-xs text-gray-500">Prix</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <Maximize2 className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
              <div className="text-lg font-semibold">{formatPrice(Number(listing.pricePerSqm || 0))}/m²</div>
              <div className="text-xs text-gray-500">Prix au m²</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <TreePine className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
              <div className="text-lg font-semibold">{LAND_TYPE_LABELS[listing.landType]}</div>
              <div className="text-xs text-gray-500">Type</div>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <div className="prose prose-gray max-w-none">
              <p className="whitespace-pre-line text-gray-600 leading-relaxed">{listing.description}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-4">Caractéristiques</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {features.filter(f => f.value).map((f) => (
                <div key={f.label} className="flex items-center gap-2 rounded-lg border border-gray-200 p-3">
                  <f.icon className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="text-sm text-gray-700">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {listing.documents.length > 0 && (
            <>
              <Separator />
              <div>
                <h2 className="text-xl font-semibold mb-4">Documents</h2>
                <div className="space-y-2">
                  {listing.documents.map((doc: any) => (
                    <a
                      key={doc.id}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm"
                    >
                      <span>{doc.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}

          {listing.latitude && listing.longitude && (
            <>
              <Separator />
              <div>
                <h2 className="text-xl font-semibold mb-4">Localisation</h2>
                <div className="aspect-[16/9] rounded-xl bg-gray-100 overflow-hidden">
                  <div className="flex h-full items-center justify-center text-gray-400">
                    <MapPin className="h-8 w-8" />
                    <span className="ml-2">Carte interactive</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Contacter l&apos;annonceur</h3>
              <ContactForm listingId={listing.id} />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Informations</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Référence</dt>
                  <dd className="text-gray-900 font-medium">{listing.reference || "N/A"}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-gray-500">Type</dt>
                  <dd className="text-gray-900 font-medium">{LAND_TYPE_LABELS[listing.landType]}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-gray-500">Surface</dt>
                  <dd className="text-gray-900 font-medium">{formatSurface(Number(listing.surface))}</dd>
                </div>
                <Separator />
                {listing.lotNumber && (
                  <>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Lot n°</dt>
                      <dd className="text-gray-900 font-medium">{listing.lotNumber}</dd>
                    </div>
                    <Separator />
                  </>
                )}
                {listing.cadastralRef && (
                  <>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Réf. cadastrale</dt>
                      <dd className="text-gray-900 font-medium">{listing.cadastralRef}</dd>
                    </div>
                    <Separator />
                  </>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-500">Vues</dt>
                  <dd className="text-gray-900 font-medium">{listing.viewCount}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
