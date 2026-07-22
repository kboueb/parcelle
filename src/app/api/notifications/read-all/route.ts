import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, requireAuth } from "@/lib/api-helpers"
import { UserRole } from "@prisma/client"

export async function PUT(_request: NextRequest) {
  const { error: authError } = await requireAuth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR])
  if (authError) return authError

  try {
    await prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    })
    return successResponse({ success: true })
  } catch (error) {
    console.error("PUT /api/notifications/read-all error:", error)
    return errorResponse("Erreur serveur", 500)
  }
}
