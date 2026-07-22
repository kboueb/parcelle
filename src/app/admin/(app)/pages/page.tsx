import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminPagesPage() {
  const pages = await prisma.editorialPage.findMany({
    orderBy: { updatedAt: "desc" },
    include: { author: { select: { name: true } } },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pages éditoriales</h2>
          <p className="text-gray-500 mt-1">Gérez les pages de contenu du site</p>
        </div>
        <Link href="/admin/pages/nouveau">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle page
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des pages ({pages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-medium text-gray-500">Titre</th>
                  <th className="text-left py-3 font-medium text-gray-500">Slug</th>
                  <th className="text-left py-3 font-medium text-gray-500">Auteur</th>
                  <th className="text-center py-3 font-medium text-gray-500">Statut</th>
                  <th className="text-left py-3 font-medium text-gray-500">Modifié le</th>
                  <th className="text-right py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr key={page.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-900">{page.title}</td>
                    <td className="py-3 text-gray-500">{page.slug}</td>
                    <td className="py-3 text-gray-600">{page.author?.name || "—"}</td>
                    <td className="py-3 text-center">
                      <Badge variant={page.isPublished ? "success" : "default"}>
                        {page.isPublished ? "Publié" : "Brouillon"}
                      </Badge>
                    </td>
                    <td className="py-3 text-gray-500">{format(page.updatedAt, "dd/MM/yyyy HH:mm", { locale: fr })}</td>
                    <td className="py-3 text-right">
                      <Link href={`/admin/pages/${page.id}`} className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
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
