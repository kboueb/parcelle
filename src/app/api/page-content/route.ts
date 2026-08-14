import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, requireAuth } from "@/lib/api-helpers"
import { UserRole } from "@prisma/client"
import { PAGE_KEYS } from "@/lib/page-content-defaults"

export async function GET() {
  try {
    const pages = await prisma.pageContent.findMany({
      orderBy: { page: "asc" },
    })
    return successResponse(pages)
  } catch (error) {
    console.error("GET /api/page-content error:", error)
    return errorResponse("Erreur serveur", 500)
  }
}

export async function PUT(request: NextRequest) {
  const { error: authError } = await requireAuth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR])
  if (authError) return authError

  try {
    const body = await request.json()
    const page = body.page as string
    if (!page || !PAGE_KEYS.includes(page as (typeof PAGE_KEYS)[number])) {
      return errorResponse("Page invalide")
    }

    const record = await prisma.pageContent.upsert({
      where: { page },
      update: {
        title: body.title ?? null,
        subtitle: body.subtitle ?? null,
        content: body.content ?? {},
        seoTitle: body.seoTitle ?? null,
        seoDescription: body.seoDescription ?? null,
        isActive: body.isActive ?? true,
      },
      create: {
        page,
        title: body.title ?? null,
        subtitle: body.subtitle ?? null,
        content: body.content ?? {},
        seoTitle: body.seoTitle ?? null,
        seoDescription: body.seoDescription ?? null,
        isActive: body.isActive ?? true,
      },
    })

    return successResponse(record)
  } catch (error) {
    console.error("PUT /api/page-content error:", error)
    return errorResponse("Erreur lors de la sauvegarde", 500)
  }
}
