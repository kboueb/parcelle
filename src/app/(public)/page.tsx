import Link from "next/link"
import { SearchBar } from "@/components/public/SearchBar"
import { prisma } from "@/lib/prisma"
import { ListingStatus } from "@prisma/client"
import { ListingCard } from "@/components/public/ListingCard"
import { serializeListings } from "@/lib/serialize"
import { ArrowRight, MapPin, Shield, Sparkles, TrendingUp } from "lucide-react"

export const dynamic = "force-dynamic"

async function getHomeData() {
  const [featuredListings, latestListings, stats] = await Promise.all([
    prisma.listing.findMany({
      where: { status: ListingStatus.PUBLISHED, isFeatured: true },
      orderBy: { publishedAt: "desc" },
      take: 8,
      select: {
        id: true, title: true, slug: true, price: true, surface: true,
        pricePerSqm: true, landType: true, listingType: true, city: true,
        department: true, postalCode: true, latitude: true, longitude: true,
        isFeatured: true, isUrgent: true, isExclusive: true, publishedAt: true,
        images: { select: { url: true, thumbnailUrl: true, isPrimary: true }, orderBy: { order: "asc" } },
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.listing.findMany({
      where: { status: ListingStatus.PUBLISHED },
      orderBy: { publishedAt: "desc" },
      take: 8,
      select: {
        id: true, title: true, slug: true, price: true, surface: true,
        pricePerSqm: true, landType: true, listingType: true, city: true,
        department: true, postalCode: true, latitude: true, longitude: true,
        isFeatured: true, isUrgent: true, isExclusive: true, publishedAt: true,
        images: { select: { url: true, thumbnailUrl: true, isPrimary: true }, orderBy: { order: "asc" } },
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.listing.aggregate({
      where: { status: ListingStatus.PUBLISHED },
      _count: true,
    }),
  ])

  return { featuredListings: serializeListings(featuredListings), latestListings: serializeListings(latestListings), totalListings: stats._count }
}

const landTypeLinks = [
  { label: "Terrain constructible", href: "/types/terrain-constructible", desc: "Pour construire votre maison" },
  { label: "Terrain viabilisé", href: "/types/terrain-viabilise", desc: "Raccordé aux réseaux" },
  { label: "Terrain agricole", href: "/types/terrain-agricole", desc: "Pour exploitation agricole" },
  { label: "Terrain forestier", href: "/types/terrain-forestier", desc: "Terrain boisé" },
  { label: "Lotissement", href: "/types/lotissement", desc: "Terrain en lotissement" },
  { label: "Non constructible", href: "/types/non-constructible", desc: "Terrain sans droit de construire" },
]

export default async function HomePage() {
  const { featuredListings, latestListings, totalListings } = await getHomeData()

  return (
    <>
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 py-20 md:py-28">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-balance">
            Trouvez le terrain idéal
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Des milliers d&apos;annonces de terrains et parcelles partout en France
          </p>
          <SearchBar variant="hero" />
        </div>
      </section>

      <section className="py-12 bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-emerald-600 mb-1">{totalListings.toLocaleString("fr-FR")}</div>
              <div className="text-sm text-gray-500">Annonces actives</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-emerald-600 mb-1">+{Math.floor(totalListings * 0.15).toLocaleString("fr-FR")}</div>
              <div className="text-sm text-gray-500">Nouvelles / mois</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-emerald-600 mb-1">95%</div>
              <div className="text-sm text-gray-500">Satisfaction</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-emerald-600 mb-1">18</div>
              <div className="text-sm text-gray-500">Régions couvertes</div>
            </div>
          </div>
        </div>
      </section>

      {featuredListings.length > 0 && (
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Annonces en avant</h2>
                <p className="text-gray-500 mt-1">Nos sélections de terrains d&apos;exception</p>
              </div>
              <Link href="/recherche?isFeatured=true" className="hidden sm:flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                Voir tout <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing as any} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Dernières annonces</h2>
              <p className="text-gray-500 mt-1">Les terrains fraîchement publiés</p>
            </div>
            <Link href="/recherche" className="hidden sm:flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium text-sm">
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing as any} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Types de terrains
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {landTypeLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-xl border border-gray-200 bg-white p-5 text-center hover:border-emerald-200 hover:shadow-md transition-all"
              >
                <div className="font-semibold text-gray-900 group-hover:text-emerald-600 mb-1">
                  {item.label}
                </div>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex gap-4 p-6 rounded-xl border border-gray-200">
              <MapPin className="h-8 w-8 text-emerald-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Recherche géographique</h3>
                <p className="text-sm text-gray-500">Trouvez des terrains par ville, département ou région avec notre carte interactive.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-xl border border-gray-200">
              <Sparkles className="h-8 w-8 text-emerald-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Filtres avancés</h3>
                <p className="text-sm text-gray-500">Affinez votre recherche par prix, surface, type de terrain et nombreux critères.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-xl border border-gray-200">
              <Shield className="h-8 w-8 text-emerald-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Annonces vérifiées</h3>
                <p className="text-sm text-gray-500">Toutes les annonces sont modérées par notre équipe pour garantir leur fiabilité.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
