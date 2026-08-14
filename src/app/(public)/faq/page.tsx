import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPageContent } from "@/lib/page-content"
import { PageHero } from "@/components/public/PageHero"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("faq")
  return {
    title: content.seoTitle || undefined,
    description: content.seoDescription || undefined,
  }
}

export default async function FaqPage() {
  const [faqs, content] = await Promise.all([
    prisma.faqEntry.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    }),
    getPageContent("faq"),
  ])

  const categories = [...new Set(faqs.filter(f => f.category).map(f => f.category))] as string[]

  const sections = content.sections as any
  const hero = sections.hero || {}

  return (
    <>
      {hero.enabled !== false ? (
        <PageHero title={content.title} subtitle={content.subtitle} image={hero.image} ctaLabel={hero.ctaLabel} ctaUrl={hero.ctaUrl} />
      ) : (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
            {content.subtitle && <p className="text-gray-500 mt-2">{content.subtitle}</p>}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">

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
    </>
  )
}
