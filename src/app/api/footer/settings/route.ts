import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, requireAuth } from "@/lib/api-helpers"
import { UserRole } from "@prisma/client"

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany()
    return successResponse(settings)
  } catch (error) {
    console.error("GET /api/footer/settings error:", error)
    return errorResponse("Erreur serveur", 500)
  }
}

export async function POST(request: NextRequest) {
  const { error: authError } = await requireAuth([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  if (authError) return authError

  try {
    const body = await request.json()
    const { key, value } = body as { key: string; value: string }
    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
    return successResponse(setting)
  } catch (error) {
    console.error("POST /api/footer/settings error:", error)
    return errorResponse("Erreur lors de la sauvegarde", 500)
  }
}
