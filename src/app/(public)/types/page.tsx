import { prisma } from "@/lib/prisma"
import { ListingStatus } from "@prisma/client"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { LAND_TYPE_LABELS } from "@/lib/constants"
import { formatPrice } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Tous les types de terrains",
  description: "Découvrez tous les types de terrains disponibles : constructible, viabilisé, agricole, forestier, lotissement, non constructible.",
}

export default async function TypesPage() {
  const types = await prisma.listing.groupBy({
    by: ["landType"],
    where: { status: ListingStatus.PUBLISHED },
    _count: true,
    _min: { price: true },
    _avg: { price: true, surface: true },
    orderBy: { _count: { landType: "desc" } },
  })

  const landTypeDescriptions: Record<string, { desc: string, color: string }> = {
    BUILDABLE: { desc: "Terrain où la construction est autorisée selon le PLU", color: "bg-emerald-50 border-emerald-200" },
    SERVICED: { desc: "Terrain raccordé aux réseaux publics (eau, électricité, gaz)", color: "bg-blue-50 border-blue-200" },
    AGRICULTURAL: { desc: "Terrain destiné à l'exploitation agricole", color: "bg-amber-50 border-amber-200" },
    FOREST: { desc: "Terrain boisé, idéal pour les activités forestières", color: "bg-green-50 border-green-200" },
    SUBDIVISION: { desc: "Terrain divisé en plusieurs lots constructibles", color: "bg-purple-50 border-purple-200" },
    NON_BUILDABLE: { desc: "Terrain où la construction est interdite", color: "bg-gray-50 border-gray-200" },
    COMMERCIAL: { desc: "Terrain destiné à un usage commercial", color: "bg-red-50 border-red-200" },
    INDUSTRIAL: { desc: "Terrain destiné à un usage industriel", color: "bg-orange-50 border-orange-200" },
    RURAL: { desc: "Terrain en zone rurale", color: "bg-teal-50 border-teal-200" },
    OTHER: { desc: "Autre type de terrain", color: "bg-gray-50 border-gray-200" },
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Types de terrains</h1>
        <p className="text-gray-500 mt-2">Explorez les annonces par type de terrain</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {types.map((type) => {
          const info = landTypeDescriptions[type.landType] || { desc: "", color: "bg-gray-50 border-gray-200" }
          const label = LAND_TYPE_LABELS[type.landType] || type.landType
          const slug = label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")

          return (
            <Link key={type.landType} href={`/types/${slug}`}>
              <Card className={`${info.color} hover:shadow-md transition-all`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{label}</h2>
                      <p className="text-sm text-gray-600 mb-4">{info.desc}</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span><strong className="text-gray-900">{type._count}</strong> annonces</span>
                        <span>Prix moy. <strong className="text-gray-900">{formatPrice(Math.round(Number(type._avg.price || 0)))}</strong></span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
