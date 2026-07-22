import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, requireAuth } from "@/lib/api-helpers"
import { UserRole } from "@prisma/client"

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    })
    return successResponse(banners)
  } catch (error) {
    return errorResponse("Erreur lors de la récupération des bannières", 500)
  }
}

export async function POST(request: NextRequest) {
  const { error: authError } = await requireAuth([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  if (authError) return authError

  try {
    const body = await request.json()
    const banner = await prisma.banner.create({ data: body })
    return successResponse(banner, 201)
  } catch (error) {
    return errorResponse("Erreur lors de la création de la bannière", 500)
  }
}
