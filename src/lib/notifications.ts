import { prisma } from "@/lib/prisma"

type NotificationType = "lead" | "listing" | "report" | "user" | "system" | "favorite" | "listing_status" | "faq" | "category" | "banner" | "page"

export async function createNotification(data: {
  type: NotificationType
  title: string
  message: string
  link?: string
  entityType?: string
  entityId?: string
}) {
  try {
    return await prisma.notification.create({ data })
  } catch (error) {
    console.error("Failed to create notification:", error)
    return null
  }
}
