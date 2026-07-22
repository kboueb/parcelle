import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, requireAuth } from "@/lib/api-helpers"
import { UserRole } from "@prisma/client"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const banner = await prisma.banner.findUnique({ where: { id } })
    if (!banner) return errorResponse("Bannière non trouvée", 404)
    return successResponse(banner)
  } catch (error) {
    console.error("GET /api/banners/[id] error:", error)
    return errorResponse("Erreur lors de la récupération", 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError } = await requireAuth([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  if (authError) return authError

  const { id } = await params

  try {
    const existing = await prisma.banner.findUnique({ where: { id } })
    if (!existing) return errorResponse("Bannière non trouvée", 404)

    const body = await request.json()
    const banner = await prisma.banner.update({ where: { id }, data: body })
    return successResponse(banner)
  } catch (error) {
    console.error("PUT /api/banners/[id] error:", error)
    return errorResponse("Erreur lors de la mise à jour", 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError } = await requireAuth([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  if (authError) return authError

  const { id } = await params

  try {
    await prisma.banner.delete({ where: { id } })
    return successResponse({ deleted: true })
  } catch (error) {
    console.error("DELETE /api/banners/[id] error:", error)
    return errorResponse("Erreur lors de la suppression", 500)
  }
}
