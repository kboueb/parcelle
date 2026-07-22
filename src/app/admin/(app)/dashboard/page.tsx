import { prisma } from "@/lib/prisma"
import { ListingStatus, ContactStatus } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { LISTING_STATUS_LABELS, LAND_TYPE_LABELS } from "@/lib/constants"
import { FileText, MessageSquare, Eye, Heart, AlertTriangle, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function getDashboardStats() {
  const [totalListings, activeListings, pendingListings, expiredListings, draftListings, totalLeads, newLeads, totalViews, totalUsers, recentListings, recentLeads] = await Promise.all([
    prisma.listing.count(),
    prisma.listing.count({ where: { status: ListingStatus.PUBLISHED } }),
    prisma.listing.count({ where: { status: ListingStatus.PENDING_REVIEW } }),
    prisma.listing.count({ where: { status: ListingStatus.EXPIRED } }),
    prisma.listing.count({ where: { status: ListingStatus.DRAFT } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: ContactStatus.NEW } }),
    prisma.listing.aggregate({ _sum: { viewCount: true } }),
    prisma.user.count(),
    prisma.listing.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, slug: true, status: true, price: true, city: true, createdAt: true } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { listing: { select: { title: true } } } }),
  ])

  return { totalListings, activeListings, pendingListings, expiredListings, draftListings, totalLeads, newLeads, totalViews: totalViews._sum.viewCount || 0, totalUsers, recentListings, recentLeads }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  const statCards = [
    { label: "Annonces actives", value: stats.activeListings, icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "En attente", value: stats.pendingListings, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Brouillons", value: stats.draftListings, icon: FileText, color: "text-gray-600", bg: "bg-gray-50" },
    { label: "Expirées", value: stats.expiredListings, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    { label: "Nouveaux leads", value: stats.newLeads, icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total leads", value: stats.totalLeads, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Vues totales", value: stats.totalViews.toLocaleString("fr-FR"), icon: Eye, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Utilisateurs", value: stats.totalUsers, icon: Users, color: "text-cyan-600", bg: "bg-cyan-50" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tableau de bord</h2>
        <p className="text-gray-500 mt-1">Vue d&apos;ensemble de votre plateforme</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`rounded-lg ${card.bg} p-2`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              <div className="text-sm text-gray-500">{card.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dernières annonces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/admin/annonces/${listing.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{listing.title}</p>
                    <p className="text-xs text-gray-500">{listing.city} · {formatPrice(Number(listing.price))}</p>
                  </div>
                  <Badge variant={listing.status === "PUBLISHED" ? "success" : listing.status === "DRAFT" ? "warning" : "default"}>
                    {LISTING_STATUS_LABELS[listing.status]}
                  </Badge>
                </Link>
              ))}
              {stats.recentListings.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">Aucune annonce récente</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Derniers messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{lead.name}</p>
                    <p className="text-xs text-gray-500 truncate">{lead.listing?.title || "N/A"}</p>
                  </div>
                  <Badge variant={lead.status === "NEW" ? "warning" : "default"}>
                    {lead.status === "NEW" ? "Nouveau" : "Lu"}
                  </Badge>
                </Link>
              ))}
              {stats.recentLeads.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">Aucun message récent</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
