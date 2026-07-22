import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, requireAuth } from "@/lib/api-helpers"
import { UserRole } from "@prisma/client"
import { slugify } from "@/lib/utils"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const region = await prisma.region.findUnique({ where: { id } })
    if (!region) return errorResponse("Région non trouvée", 404)
    return successResponse(region)
  } catch (error) {
    return errorResponse("Erreur lors de la récupération", 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError } = await requireAuth([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  if (authError) return authError

  const { id } = await params

  try {
    const existing = await prisma.region.findUnique({ where: { id } })
    if (!existing) return errorResponse("Région non trouvée", 404)

    const body = await request.json()
    const region = await prisma.region.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.name ? slugify(body.name) : undefined,
        isActive: body.isActive,
        order: body.order,
      },
    })
    return successResponse(region)
  } catch (error: any) {
    if (error?.code === "P2002") {
      return errorResponse("Une région avec ce nom existe déjà")
    }
    return errorResponse("Erreur lors de la mise à jour", 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError } = await requireAuth([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  if (authError) return authError

  const { id } = await params

  try {
    await prisma.region.delete({ where: { id } })
    return successResponse({ deleted: true })
  } catch (error) {
    return errorResponse("Erreur lors de la suppression", 500)
  }
}
