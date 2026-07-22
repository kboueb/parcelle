import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, requireAuth } from "@/lib/api-helpers"
import { listingSchema } from "@/lib/validations"
import { slugify } from "@/lib/utils"
import { UserRole, ListingStatus } from "@prisma/client"
import { serializeListing } from "@/lib/serialize"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const listing = await prisma.listing.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        images: { orderBy: { order: "asc" } },
        documents: true,
        category: true,
        seoMetadata: true,
      },
    })

    if (!listing) return errorResponse("Annonce non trouvée", 404)

    if (listing.status === ListingStatus.PUBLISHED) {
      await prisma.listing.update({
        where: { id: listing.id },
        data: { viewCount: { increment: 1 } },
      })
    }

    return successResponse(serializeListing(listing))
  } catch (error) {
    console.error("GET /api/listings/[id] error:", error)
    return errorResponse("Erreur lors de la récupération de l'annonce", 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError, session } = await requireAuth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR, UserRole.EDITOR])
  if (authError) return authError

  const { id } = await params

  try {
    const existing = await prisma.listing.findUnique({ where: { id } })
    if (!existing) return errorResponse("Annonce non trouvée", 404)

    const body = await request.json()
    const { images: imageData, ...bodyFields } = body
    const validation = listingSchema.partial().safeParse(bodyFields)
    if (!validation.success) {
      return errorResponse(validation.error.issues.map(e => e.message).join(", "))
    }

    const data = validation.data as any

    if (!data.categoryId) {
      data.categoryId = null
    }

    if (data.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
      data.publishedAt = new Date()
    }

    if (data.surface && data.price) {
      data.pricePerSqm = Math.round(data.price / data.surface)
    }

    if (data.title && data.city && (data.title !== existing.title || data.city !== existing.city)) {
      data.slug = slugify(`${data.city}-${data.title}-${Date.now()}`)
    }

    if (imageData) {
      const incomingIds = imageData.filter((img: any) => img.id).map((img: any) => img.id)
      await prisma.media.deleteMany({ where: { listingId: id, id: { notIn: incomingIds } } })
      for (const img of imageData) {
        if (img.id) {
          await prisma.media.update({ where: { id: img.id }, data: { isPrimary: img.isPrimary, order: img.order } })
        } else {
          await prisma.media.create({ data: { url: img.url, isPrimary: img.isPrimary, order: img.order, listingId: id } })
        }
      }
    }

    const listing = await prisma.listing.update({
      where: { id },
      data: {
        ...data,
        updatedById: (session!.user as any).id,
      },
      include: { images: { orderBy: { order: "asc" } }, category: true, documents: true },
    })

    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entityType: "Listing",
        entityId: listing.id,
        userId: (session!.user as any).id,
        details: body,
      },
    })

    return successResponse(listing)
  } catch (error) {
    console.error("PUT /api/listings/[id] error:", error)
    return errorResponse("Erreur lors de la mise à jour de l'annonce", 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error: authError, session } = await requireAuth([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  if (authError) return authError

  const { id } = await params

  try {
    const listing = await prisma.listing.findUnique({ where: { id } })
    if (!listing) return errorResponse("Annonce non trouvée", 404)

    await prisma.listing.delete({ where: { id } })

    await prisma.auditLog.create({
      data: {
        action: "DELETE",
        entityType: "Listing",
        entityId: id,
        userId: (session!.user as any).id,
      },
    })

    return successResponse({ deleted: true })
  } catch (error) {
    console.error("DELETE /api/listings/[id] error:", error)
    return errorResponse("Erreur lors de la suppression de l'annonce", 500)
  }
}
