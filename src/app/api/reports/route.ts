import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, requireAuth } from "@/lib/api-helpers"
import { createNotification } from "@/lib/notifications"
import { UserRole } from "@prisma/client"

export async function GET() {
  const { error: authError } = await requireAuth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR])
  if (authError) return authError

  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      include: { listing: { select: { title: true, slug: true } } },
    })
    return successResponse(reports)
  } catch (error) {
    return errorResponse("Erreur lors de la récupération des signalements", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const report = await prisma.report.create({
      data: {
        listingId: body.listingId,
        reason: body.reason,
        description: body.description,
      },
    })

    const listing = body.listingId
      ? await prisma.listing.findUnique({ where: { id: body.listingId }, select: { title: true } })
      : null

    createNotification({
      type: "report",
      title: "Nouveau signalement",
      message: `Signalement « ${body.reason} » pour « ${listing?.title || "une annonce"} »`,
      link: "/admin/signalements",
      entityType: "Report",
      entityId: report.id,
    })
    return successResponse(report, 201)
  } catch (error) {
    return errorResponse("Erreur lors du signalement", 500)
  }
}
