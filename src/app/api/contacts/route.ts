import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, requireAuth } from "@/lib/api-helpers"
import { contactSchema } from "@/lib/validations"
import { createNotification } from "@/lib/notifications"
import { UserRole, ContactStatus } from "@prisma/client"

export async function GET() {
  const { error: authError } = await requireAuth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR])
  if (authError) return authError

  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: { listing: { select: { id: true, title: true, slug: true } } },
    })
    return successResponse(leads)
  } catch (error) {
    return errorResponse("Erreur lors de la récupération des contacts", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = contactSchema.safeParse(body)
    if (!validation.success) {
      return errorResponse(validation.error.issues.map(e => e.message).join(", "))
    }

    const lead = await prisma.lead.create({
      data: { ...validation.data, status: ContactStatus.NEW },
    })

    await prisma.listing.update({
      where: { id: validation.data.listingId },
      data: { contactCount: { increment: 1 } },
    })

    const listing = await prisma.listing.findUnique({
      where: { id: validation.data.listingId },
      select: { title: true, slug: true },
    })

    createNotification({
      type: "lead",
      title: "Nouveau lead",
      message: `${validation.data.name} a contacté pour « ${listing?.title || "une annonce"} »`,
      link: "/admin/leads",
      entityType: "Lead",
      entityId: lead.id,
    })

    return successResponse(lead, 201)
  } catch (error) {
    return errorResponse("Erreur lors de l'envoi du message", 500)
  }
}
