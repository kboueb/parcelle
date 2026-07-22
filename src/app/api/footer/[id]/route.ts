import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, requireAuth } from "@/lib/api-helpers"
import { UserRole } from "@prisma/client"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const link = await prisma.footerLink.findUnique({ where: { id } })
    if (!link) return errorResponse("Lien non trouvé", 404)
    return successResponse(link)
  } catch (error) {
    console.error("GET /api/footer/[id] error:", error)
    return errorResponse("Erreur serveur", 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError } = await requireAuth([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  if (authError) return authError

  try {
    const { id } = await params
    const body = await request.json()
    const link = await prisma.footerLink.update({ where: { id }, data: body })
    return successResponse(link)
  } catch (error) {
    console.error("PUT /api/footer/[id] error:", error)
    return errorResponse("Erreur lors de la mise à jour", 500)
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError } = await requireAuth([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  if (authError) return authError

  try {
    const { id } = await params
    await prisma.footerLink.delete({ where: { id } })
    return successResponse({ success: true })
  } catch (error) {
    console.error("DELETE /api/footer/[id] error:", error)
    return errorResponse("Erreur lors de la suppression", 500)
  }
}
