import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { REPORT_REASON_LABELS } from "@/lib/constants"

export const dynamic = "force-dynamic"

export default async function AdminReportsPage() {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: { listing: { select: { title: true, slug: true } } },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Signalements</h2>
        <p className="text-gray-500 mt-1">Modération des contenus signalés</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {reports.map((report) => (
              <div key={report.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <Badge variant={
                      report.status === "RESOLVED" ? "success" :
                      report.status === "DISMISSED" ? "default" :
                      report.status === "INVESTIGATING" ? "warning" :
                      "destructive"
                    }>
                      {report.status}
                    </Badge>
                    <span className="ml-2 font-medium text-gray-900">
                      {REPORT_REASON_LABELS[report.reason]}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(report.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                {report.description && (
                  <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                )}
                <p className="text-xs text-gray-400">
                  Annonce : {report.listing?.title || "Supprimée"}
                </p>
              </div>
            ))}
            {reports.length === 0 && (
              <p className="text-center py-8 text-gray-400">Aucun signalement</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
