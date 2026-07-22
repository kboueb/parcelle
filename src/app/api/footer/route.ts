import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, requireAuth } from "@/lib/api-helpers"
import { UserRole } from "@prisma/client"

export async function GET() {
  try {
    const links = await prisma.footerLink.findMany({
      orderBy: { order: "asc" },
    })
    return successResponse(links)
  } catch (error) {
    console.error("GET /api/footer error:", error)
    return errorResponse("Erreur lors de la récupération", 500)
  }
}

export async function POST(request: NextRequest) {
  const { error: authError } = await requireAuth([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  if (authError) return authError

  try {
    const body = await request.json()
    const link = await prisma.footerLink.create({ data: body })
    return successResponse(link, 201)
  } catch (error) {
    console.error("POST /api/footer error:", error)
    return errorResponse("Erreur lors de la création", 500)
  }
}
