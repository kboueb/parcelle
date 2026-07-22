import { prisma } from "@/lib/prisma"
import { ListingStatus } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LAND_TYPE_LABELS } from "@/lib/constants"

export const dynamic = "force-dynamic"

export default async function AdminStatsPage() {
  const [totalListings, activeListings, totalLeads, totalFavorites, totalAlerts, totalViews, listingsByStatus, listingsByLandType] = await Promise.all([
    prisma.listing.count(),
    prisma.listing.count({ where: { status: ListingStatus.PUBLISHED } }),
    prisma.lead.count(),
    prisma.favorite.count(),
    prisma.alert.count(),
    prisma.listing.aggregate({ _sum: { viewCount: true } }),
    prisma.listing.groupBy({ by: ["status"], _count: true }),
    prisma.listing.groupBy({ by: ["landType"], _count: true, where: { status: ListingStatus.PUBLISHED } }),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Statistiques</h2>
        <p className="text-gray-500 mt-1">Indicateurs clés de la plateforme</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Annonces totales", value: totalListings },
          { label: "Annonces actives", value: activeListings },
          { label: "Leads reçus", value: totalLeads },
          { label: "Favoris", value: totalFavorites },
          { label: "Alertes", value: totalAlerts },
          { label: "Vues totales", value: totalViews._sum.viewCount || 0 },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString("fr-FR")}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Répartition par statut</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {listingsByStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.status}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${(item._count / totalListings) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">{item._count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par type de terrain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {listingsByLandType.map((item) => (
                <div key={item.landType} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{LAND_TYPE_LABELS[item.landType] || item.landType}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(item._count / activeListings) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">{item._count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
