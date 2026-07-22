import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "FAQ - Questions fréquentes",
  description: "Retrouvez les réponses aux questions les plus fréquentes sur l'achat et la location de terrains en France.",
}

export default async function FaqPage() {
  const faqs = await prisma.faqEntry.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  })

  const categories = [...new Set(faqs.filter(f => f.category).map(f => f.category))] as string[]

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Questions fréquentes</h1>
        <p className="text-gray-500 mt-2">Tout ce que vous devez savoir sur l&apos;achat et la location de terrains</p>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{category}</h2>
            <div className="space-y-3">
              {faqs.filter(f => f.category === category).map((faq) => (
                <Card key={faq.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
