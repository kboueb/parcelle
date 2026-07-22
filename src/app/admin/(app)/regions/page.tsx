import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminRegionsPage() {
  const regions = await prisma.region.findMany({
    orderBy: { order: "asc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Régions</h2>
          <p className="text-gray-500 mt-1">Gérez les régions disponibles sur le site</p>
        </div>
        <Link href="/admin/regions/nouveau">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle région
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des régions ({regions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-medium text-gray-500">Ordre</th>
                  <th className="text-left py-3 font-medium text-gray-500">Nom</th>
                  <th className="text-left py-3 font-medium text-gray-500">Slug</th>
                  <th className="text-center py-3 font-medium text-gray-500">Statut</th>
                  <th className="text-right py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {regions.map((region) => (
                  <tr key={region.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 text-gray-500">{region.order}</td>
                    <td className="py-3 font-medium text-gray-900">{region.name}</td>
                    <td className="py-3 text-gray-500">{region.slug}</td>
                    <td className="py-3 text-center">
                      <Badge variant={region.isActive ? "success" : "default"}>
                        {region.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Link href={`/admin/regions/${region.id}`} className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                        <Edit className="h-4 w-4" />
                        Modifier
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
