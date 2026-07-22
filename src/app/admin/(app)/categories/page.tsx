import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { listings: true } } },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Catégories</h2>
          <p className="text-gray-500 mt-1">Gérez les types de terrain et catégories</p>
        </div>
        <Link href="/admin/categories/nouveau">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle catégorie
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des catégories ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-medium text-gray-500">Ordre</th>
                  <th className="text-left py-3 font-medium text-gray-500">Nom</th>
                  <th className="text-left py-3 font-medium text-gray-500">Slug</th>
                  <th className="text-center py-3 font-medium text-gray-500">Annonces</th>
                  <th className="text-center py-3 font-medium text-gray-500">Statut</th>
                  <th className="text-right py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 text-gray-500">{cat.order}</td>
                    <td className="py-3 font-medium text-gray-900">{cat.name}</td>
                    <td className="py-3 text-gray-500">{cat.slug}</td>
                    <td className="py-3 text-center">{cat._count.listings}</td>
                    <td className="py-3 text-center">
                      <Badge variant={cat.isActive ? "success" : "default"}>
                        {cat.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Link href={`/admin/categories/${cat.id}`} className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
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
