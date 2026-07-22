import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-helpers"

function getVisitorId(request: NextRequest): string {
  return request.headers.get("x-visitor-id") || request.cookies.get("visitor_id")?.value || "anonymous"
}

export async function GET(request: NextRequest) {
  const visitorId = getVisitorId(request)
  try {
    const comparisons = await prisma.comparison.findMany({
      where: { visitorId },
      include: {
        listing: {
          select: {
            id: true, title: true, slug: true, price: true, surface: true,
            landType: true, city: true, department: true, pricePerSqm: true,
            images: { select: { url: true, thumbnailUrl: true, isPrimary: true }, orderBy: { order: "asc" } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return successResponse(comparisons)
  } catch (error) {
    return errorResponse("Erreur lors de la récupération des comparaisons", 500)
  }
}

export async function POST(request: NextRequest) {
  const visitorId = getVisitorId(request)
  try {
    const { listingId } = await request.json()

    const count = await prisma.comparison.count({ where: { visitorId } })
    if (count >= 5) return errorResponse("Maximum 5 annonces à comparer")

    await prisma.comparison.create({ data: { visitorId, listingId } })
    return successResponse({ added: true }, 201)
  } catch (error) {
    return errorResponse("Erreur lors de l'ajout à la comparaison", 500)
  }
}

export async function DELETE(request: NextRequest) {
  const visitorId = getVisitorId(request)
  try {
    const { listingId } = await request.json()
    await prisma.comparison.deleteMany({ where: { visitorId, listingId } })
    return successResponse({ deleted: true })
  } catch (error) {
    return errorResponse("Erreur lors de la suppression de la comparaison", 500)
  }
}
