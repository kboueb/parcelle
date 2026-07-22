import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CONTACT_STATUS_LABELS } from "@/lib/constants"

export const dynamic = "force-dynamic"

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { listing: { select: { title: true, slug: true } } },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Leads</h2>
        <p className="text-gray-500 mt-1">Messages des visiteurs ({leads.length})</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {leads.map((lead) => (
              <div key={lead.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-medium text-gray-900">{lead.name}</span>
                    <span className="text-gray-400 mx-2">·</span>
                    <span className="text-sm text-gray-500">{lead.email}</span>
                    {lead.phone && (
                      <>
                        <span className="text-gray-400 mx-2">·</span>
                        <span className="text-sm text-gray-500">{lead.phone}</span>
                      </>
                    )}
                  </div>
                  <Badge variant={lead.status === "NEW" ? "warning" : lead.status === "REPLIED" ? "success" : "default"}>
                    {CONTACT_STATUS_LABELS[lead.status]}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{lead.message}</p>
                <p className="text-xs text-gray-400">
                  À propos de : {lead.listing?.title || "Annonce supprimée"}
                  <span className="mx-2">·</span>
                  {new Date(lead.createdAt).toLocaleDateString("fr-FR", { dateStyle: "long" })}
                </p>
              </div>
            ))}
            {leads.length === 0 && (
              <p className="text-center py-8 text-gray-400">Aucun message pour le moment</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
