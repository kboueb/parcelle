import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, requireAuth } from "@/lib/api-helpers"
import { UserRole } from "@prisma/client"
import { slugify } from "@/lib/utils"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const page = await prisma.editorialPage.findUnique({ where: { id }, include: { author: { select: { name: true } } } })
    if (!page) return errorResponse("Page non trouvée", 404)
    return successResponse(page)
  } catch (error) {
    console.error("GET /api/editorial/[id] error:", error)
    return errorResponse("Erreur lors de la récupération", 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError, session } = await requireAuth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR])
  if (authError) return authError

  const { id } = await params

  try {
    const existing = await prisma.editorialPage.findUnique({ where: { id } })
    if (!existing) return errorResponse("Page non trouvée", 404)

    const body = await request.json()
    const data: any = { ...body }

    if (data.title) {
      data.slug = slugify(data.title)
    }
    if (data.isPublished && !existing.publishedAt) {
      data.publishedAt = new Date()
    }

    const page = await prisma.editorialPage.update({
      where: { id },
      data: {
        ...data,
        authorId: (session!.user as any).id,
      },
    })
    return successResponse(page)
  } catch (error) {
    console.error("PUT /api/editorial/[id] error:", error)
    return errorResponse("Erreur lors de la mise à jour", 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError } = await requireAuth([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  if (authError) return authError

  const { id } = await params

  try {
    await prisma.editorialPage.delete({ where: { id } })
    return successResponse({ deleted: true })
  } catch (error) {
    console.error("DELETE /api/editorial/[id] error:", error)
    return errorResponse("Erreur lors de la suppression", 500)
  }
}
