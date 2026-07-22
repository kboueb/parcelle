import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { BookOpen, ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function PublicPagesPage() {
  const pages = await prisma.editorialPage.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
        <p className="text-gray-500 mt-2">Informations et ressources</p>
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune page</h3>
          <p className="text-gray-500">Aucune page n&apos;a été publiée pour le moment</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Link
              key={page.id}
              href={`/pages/${page.slug}`}
              className="group rounded-xl border border-gray-200 overflow-hidden hover:border-emerald-200 hover:shadow-md transition-all"
            >
              {page.imageUrl ? (
                <div className="aspect-[16/6] bg-gray-100">
                  <img src={page.imageUrl} alt="" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="aspect-[16/6] bg-gradient-to-br from-emerald-50 to-gray-50 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-emerald-400" />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors mb-1">
                  {page.title}
                </h3>
                {page.excerpt && (
                  <p className="text-sm text-gray-500 line-clamp-2">{page.excerpt}</p>
                )}
                <div className="flex items-center gap-1 mt-3 text-sm text-emerald-600 font-medium">
                  Lire la suite <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
