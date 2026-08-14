import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { ListingStatus } from "@prisma/client"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { getPageContent } from "@/lib/page-content"
import { PageHero } from "@/components/public/PageHero"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("departements")
  return {
    title: content.seoTitle || undefined,
    description: content.seoDescription || undefined,
  }
}

export default async function DepartmentsPage() {
  const [departments, content] = await Promise.all([
    prisma.listing.groupBy({
      by: ["department", "departmentCode"],
      where: { status: ListingStatus.PUBLISHED },
      _count: true,
      _min: { price: true },
      orderBy: { department: "asc" },
    }),
    getPageContent("departements"),
  ])

  const sections = content.sections as any
  const hero = sections.hero || {}

  return (
    <div className="flex-1">
      {hero.enabled !== false ? (
        <PageHero title={content.title} subtitle={content.subtitle} image={hero.image} ctaLabel={hero.ctaLabel} ctaUrl={hero.ctaUrl} />
      ) : (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
            {content.subtitle && <p className="text-gray-500 mt-2">{content.subtitle}</p>}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {departments.map((dept) => (
          <Link
            key={dept.departmentCode}
            href={`/departements/${dept.departmentCode}`}
            className="block"
          >
            <Card className="hover:border-emerald-200 hover:shadow-md transition-all text-center">
              <CardContent className="p-4">
                <div className="text-lg font-bold text-emerald-600">{dept.departmentCode}</div>
                <div className="text-sm text-gray-600 truncate">{dept.department}</div>
                <div className="text-xs text-gray-400 mt-1">{dept._count} annonces</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      </div>
    </div>
  )
}
