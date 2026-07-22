import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, requireAuth } from "@/lib/api-helpers"
import { UserRole } from "@prisma/client"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { listings: true } } },
    })
    if (!category) return errorResponse("Catégorie non trouvée", 404)
    return successResponse(category)
  } catch (error) {
    console.error("GET /api/categories/[id] error:", error)
    return errorResponse("Erreur lors de la récupération de la catégorie", 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError } = await requireAuth([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  if (authError) return authError

  const { id } = await params

  try {
    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing) return errorResponse("Catégorie non trouvée", 404)

    const body = await request.json()
    const category = await prisma.category.update({ where: { id }, data: body })
    return successResponse(category)
  } catch (error) {
    console.error("PUT /api/categories/[id] error:", error)
    return errorResponse("Erreur lors de la mise à jour", 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError } = await requireAuth([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  if (authError) return authError

  const { id } = await params

  try {
    await prisma.category.delete({ where: { id } })
    return successResponse({ deleted: true })
  } catch (error) {
    console.error("DELETE /api/categories/[id] error:", error)
    return errorResponse("Erreur lors de la suppression", 500)
  }
}
