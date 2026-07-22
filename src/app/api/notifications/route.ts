import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, requireAuth } from "@/lib/api-helpers"
import { UserRole } from "@prisma/client"

export async function GET(request: NextRequest) {
  const { error: authError } = await requireAuth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR])
  if (authError) return authError

  const url = new URL(request.url)
  const unreadOnly = url.searchParams.get("unread") === "true"
  const limit = Math.min(Number(url.searchParams.get("limit") || "50"), 100)

  try {
    const where: any = {}
    if (unreadOnly) where.isRead = false

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
      prisma.notification.count({ where: { isRead: false } }),
    ])

    return successResponse({ notifications, unreadCount })
  } catch (error) {
    console.error("GET /api/notifications error:", error)
    return errorResponse("Erreur serveur", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, title, message, link, entityType, entityId } = body

    if (!type || !title || !message) {
      return errorResponse("type, title et message requis")
    }

    const notification = await prisma.notification.create({
      data: { type, title, message, link, entityType, entityId },
    })

    return successResponse(notification, 201)
  } catch (error) {
    console.error("POST /api/notifications error:", error)
    return errorResponse("Erreur lors de la création", 500)
  }
}
