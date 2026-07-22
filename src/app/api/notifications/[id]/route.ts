import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, requireAuth } from "@/lib/api-helpers"
import { UserRole } from "@prisma/client"

export async function PUT(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError } = await requireAuth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR])
  if (authError) return authError

  try {
    const { id } = await params
    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    })
    return successResponse(notification)
  } catch (error) {
    console.error("PUT /api/notifications/[id] error:", error)
    return errorResponse("Erreur serveur", 500)
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError } = await requireAuth([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  if (authError) return authError

  try {
    const { id } = await params
    await prisma.notification.delete({ where: { id } })
    return successResponse({ deleted: true })
  } catch (error) {
    console.error("DELETE /api/notifications/[id] error:", error)
    return errorResponse("Erreur serveur", 500)
  }
}
