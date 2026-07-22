import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { listings: true } } },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Utilisateurs</h2>
        <p className="text-gray-500 mt-1">Gestion des comptes administrateurs</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comptes ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-medium text-gray-500">Nom</th>
                  <th className="text-left py-3 font-medium text-gray-500">Email</th>
                  <th className="text-center py-3 font-medium text-gray-500">Rôle</th>
                  <th className="text-center py-3 font-medium text-gray-500">Annonces</th>
                  <th className="text-center py-3 font-medium text-gray-500">Statut</th>
                  <th className="text-right py-3 font-medium text-gray-500">Dernière connexion</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-900">{user.name}</td>
                    <td className="py-3 text-gray-500">{user.email}</td>
                    <td className="py-3 text-center">
                      <Badge variant={user.role === "SUPER_ADMIN" ? "primary" : "secondary"}>
                        {user.role === "SUPER_ADMIN" ? "Super Admin" : user.role === "ADMIN" ? "Admin" : user.role === "MODERATOR" ? "Modérateur" : "Éditeur"}
                      </Badge>
                    </td>
                    <td className="py-3 text-center">{user._count.listings}</td>
                    <td className="py-3 text-center">
                      <Badge variant={user.isActive ? "success" : "destructive"}>
                        {user.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </td>
                    <td className="py-3 text-right text-gray-500">
                      {user.lastLoginAt ? user.lastLoginAt.toLocaleDateString("fr-FR") : "Jamais"}
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
