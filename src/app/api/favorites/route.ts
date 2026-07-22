import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-helpers"

function getVisitorId(request: NextRequest): string {
  return request.headers.get("x-visitor-id") || request.cookies.get("visitor_id")?.value || "anonymous"
}

function serialize(val: any): any {
  if (Array.isArray(val)) return val.map(serialize)
  if (val && typeof val === "object" && val.constructor?.name === "Decimal") return Number(val)
  if (val && typeof val === "object") {
    const out: any = {}
    for (const [k, v] of Object.entries(val)) out[k] = serialize(v)
    return out
  }
  return val
}

export async function GET(request: NextRequest) {
  const visitorId = getVisitorId(request)
  try {
    const favorites = await prisma.favorite.findMany({
      where: { visitorId },
      include: {
        listing: {
          select: {
            id: true, title: true, slug: true, price: true, surface: true,
            landType: true, listingType: true, city: true, department: true, postalCode: true,
            latitude: true, longitude: true, pricePerSqm: true,
            isFeatured: true, isUrgent: true, isExclusive: true, publishedAt: true,
            images: { select: { url: true, thumbnailUrl: true, isPrimary: true }, orderBy: { order: "asc" } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return successResponse(serialize(favorites))
  } catch (error) {
    return errorResponse("Erreur lors de la récupération des favoris", 500)
  }
}

export async function POST(request: NextRequest) {
  const visitorId = getVisitorId(request)
  try {
    const { listingId } = await request.json()
    if (!listingId) return errorResponse("listingId requis")

    const existing = await prisma.favorite.findUnique({
      where: { visitorId_listingId: { visitorId, listingId } },
    })
    if (existing) return errorResponse("Déjà en favoris")

    const favorite = await prisma.favorite.create({ data: { visitorId, listingId } })
    return successResponse(favorite, 201)
  } catch (error) {
    return errorResponse("Erreur lors de l'ajout aux favoris", 500)
  }
}

export async function DELETE(request: NextRequest) {
  const visitorId = getVisitorId(request)
  try {
    const { listingId } = await request.json()
    if (!listingId) return errorResponse("listingId requis")

    await prisma.favorite.deleteMany({ where: { visitorId, listingId } })
    return successResponse({ deleted: true })
  } catch (error) {
    return errorResponse("Erreur lors de la suppression des favoris", 500)
  }
}
