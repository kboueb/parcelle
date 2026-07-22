import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, requireAuth } from "@/lib/api-helpers"
import { UserRole } from "@prisma/client"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: { _count: { select: { listings: { where: { status: "PUBLISHED" } } } } },
    })
    return successResponse(categories)
  } catch (error) {
    console.error("GET /api/categories error:", error)
    return errorResponse("Erreur lors de la récupération des catégories", 500)
  }
}

export async function POST(request: NextRequest) {
  const { error: authError } = await requireAuth([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  if (authError) return authError

  try {
    const body = await request.json()
    const category = await prisma.category.create({ data: body })
    return successResponse(category, 201)
  } catch (error) {
    return errorResponse("Erreur lors de la création de la catégorie", 500)
  }
}
