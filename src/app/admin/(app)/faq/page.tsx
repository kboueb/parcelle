import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminFaqPage() {
  const faqs = await prisma.faqEntry.findMany({
    orderBy: { order: "asc" },
  })

  const groupedFaqs = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    const cat = faq.category || "Général"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(faq)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">FAQ</h2>
          <p className="text-gray-500 mt-1">Gestion des questions fréquentes</p>
        </div>
        <Link href="/admin/faq/nouveau">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle FAQ
          </Button>
        </Link>
      </div>

      {Object.entries(groupedFaqs).map(([category, faqList]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faqList.map((faq) => (
                <Link
                  key={faq.id}
                  href={`/admin/faq/${faq.id}`}
                  className="flex items-start justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {!faq.isPublished && <Badge variant="warning">Non publié</Badge>}
                    </div>
                    <p className="text-sm text-gray-600">{faq.answer.substring(0, 150)}...</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-xs text-gray-400">Ordre: {faq.order}</span>
                    <Edit className="h-4 w-4 text-gray-300 group-hover:text-emerald-600 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
