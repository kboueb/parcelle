import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const page = await prisma.editorialPage.findFirst({
    where: { slug, isPublished: true },
    select: { title: true, excerpt: true },
  })
  if (!page) return {}
  return { title: page.title, description: page.excerpt || page.title }
}

export default async function PublicPageDetail({ params }: Props) {
  const { slug } = await params

  const page = await prisma.editorialPage.findFirst({
    where: { slug, isPublished: true },
  })

  if (!page) notFound()

  return (
    <>
      {page.imageUrl && (
        <div className="relative h-64 md:h-80 bg-gray-900">
          <img src={page.imageUrl} alt="" className="h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{page.title}</h1>
            {page.publishedAt && (
              <div className="flex items-center gap-1.5 text-sm text-gray-300">
                <Calendar className="h-4 w-4" />
                Publié le {format(page.publishedAt, "dd MMMM yyyy", { locale: fr })}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {!page.imageUrl && (
          <div className="mb-6">
            <Link href="/pages" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Retour aux pages
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{page.title}</h1>
            {page.publishedAt && (
              <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                Publié le {format(page.publishedAt, "dd MMMM yyyy", { locale: fr })}
              </div>
            )}
          </div>
        )}

        <div className="max-w-3xl">
          <div className="prose prose-gray max-w-none">
            {page.content.split("\n").map((paragraph, i) => (
              paragraph.trim() ? <p key={i}>{paragraph}</p> : <br key={i} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
