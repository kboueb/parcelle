import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, requireAuth } from "@/lib/api-helpers"
import { UserRole } from "@prisma/client"

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany()
    const obj: Record<string, string> = {}
    for (const s of settings) obj[s.key] = s.value
    return successResponse(obj)
  } catch (error) {
    console.error("GET /api/settings error:", error)
    return errorResponse("Erreur serveur", 500)
  }
}

export async function PUT(request: NextRequest) {
  const { error: authError } = await requireAuth([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  if (authError) return authError

  try {
    const body = await request.json() as Record<string, string>
    const ops = Object.entries(body).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
    await prisma.$transaction(ops)
    return successResponse({ success: true })
  } catch (error) {
    console.error("PUT /api/settings error:", error)
    return errorResponse("Erreur lors de la sauvegarde", 500)
  }
}
