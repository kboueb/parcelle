import { prisma } from "@/lib/prisma"
import { ListingStatus } from "@prisma/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { formatPrice, formatSurface } from "@/lib/utils"
import { LISTING_STATUS_LABELS, LAND_TYPE_LABELS, ITEMS_PER_PAGE_ADMIN } from "@/lib/constants"
import { Plus, Search, Edit, Eye } from "lucide-react"
import { DeleteListingButton } from "@/components/admin/DeleteListingButton"

export const dynamic = "force-dynamic"

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminListingsPage({ searchParams }: Props) {
  const sp = await searchParams
  const page = Math.max(1, Number(sp.page) || 1)
  const q = sp.q as string | undefined
  const status = sp.status as string | undefined
  const skip = (page - 1) * ITEMS_PER_PAGE_ADMIN

  const where: any = {}
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
      { reference: { contains: q, mode: "insensitive" } },
    ]
  }
  if (status) where.status = status

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: ITEMS_PER_PAGE_ADMIN,
      include: {
        author: { select: { name: true } },
        _count: { select: { images: true, leads: true } },
      },
    }),
    prisma.listing.count({ where }),
  ])

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE_ADMIN)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Annonces</h2>
          <p className="text-gray-500 mt-1">{total} annonce{total > 1 ? "s" : ""} au total</p>
        </div>
        <Link href="/admin/annonces/nouveau">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle annonce
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <form>
                <Input
                  name="q"
                  defaultValue={q}
                  placeholder="Rechercher par titre, ville, référence..."
                  className="pl-9"
                />
              </form>
            </div>
            <div className="flex gap-2">
              {["", "PUBLISHED", "DRAFT", "PENDING_REVIEW", "ARCHIVED", "EXPIRED", "REJECTED"].map((s) => (
                <Link
                  key={s}
                  href={s ? `/admin/annonces?status=${s}` : "/admin/annonces"}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    (s === "" && !status) || status === s
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s ? LISTING_STATUS_LABELS[s] : "Tous"}
                </Link>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Réf.</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Titre</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Ville</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Prix</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Surface</th>
                  <th className="text-center py-3 px-2 font-medium text-gray-500">Statut</th>
                  <th className="text-center py-3 px-2 font-medium text-gray-500">Vues</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 text-gray-500 font-mono text-xs">{listing.reference || "—"}</td>
                    <td className="py-3 px-2">
                      <div className="font-medium text-gray-900 truncate max-w-[200px]">{listing.title}</div>
                      <div className="text-xs text-gray-400">{listing.landType}</div>
                    </td>
                    <td className="py-3 px-2 text-gray-600">{listing.city}</td>
                    <td className="py-3 px-2 text-right font-medium">{formatPrice(Number(listing.price))}</td>
                    <td className="py-3 px-2 text-right text-gray-600">{formatSurface(Number(listing.surface))}</td>
                    <td className="py-3 px-2 text-center">
                      <Badge variant={
                        listing.status === "PUBLISHED" ? "success" :
                        listing.status === "DRAFT" ? "warning" :
                        listing.status === "EXPIRED" ? "destructive" :
                        listing.status === "PENDING_REVIEW" ? "secondary" :
                        "default"
                      }>
                        {LISTING_STATUS_LABELS[listing.status]}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-center text-gray-500">{listing.viewCount}</td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/annonces/${listing.id}`} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <Link href={`/terrain/${listing.slug}`} target="_blank" className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <DeleteListingButton listingId={listing.id} listingTitle={listing.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/admin/annonces?page=${p}${status ? `&status=${status}` : ""}${q ? `&q=${q}` : ""}`}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    p === page ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
