import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, paginatedResponse, requireAuth } from "@/lib/api-helpers"
import { listingSchema } from "@/lib/validations"
import { slugify, generateReference } from "@/lib/utils"
import { createNotification } from "@/lib/notifications"
import { Prisma, UserRole, ListingStatus, LandType, ListingType } from "@prisma/client"
import { serializeListings } from "@/lib/serialize"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, Number(searchParams.get("page")) || 1)
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 24))
    const skip = (page - 1) * limit

    const filters: Prisma.ListingWhereInput = {
      status: ListingStatus.PUBLISHED,
    }

    const q = searchParams.get("q")
    const city = searchParams.get("city")
    const department = searchParams.get("department")
    const region = searchParams.get("region")
    const postalCode = searchParams.get("postalCode")
    const landType = searchParams.get("landType")
    const listingType = searchParams.get("listingType")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const minSurface = searchParams.get("minSurface")
    const maxSurface = searchParams.get("maxSurface")
    const isServiced = searchParams.get("isServiced")
    const isBuildable = searchParams.get("isBuildable")
    const hasElectricity = searchParams.get("hasElectricity")
    const hasWaterAccess = searchParams.get("hasWaterAccess")
    const hasRoadAccess = searchParams.get("hasRoadAccess")
    const isUrgent = searchParams.get("isUrgent")
    const isExclusive = searchParams.get("isExclusive")

    if (q) {
      filters.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { department: { contains: q, mode: "insensitive" } },
        { postalCode: { startsWith: q } },
      ]
    }
    if (city) filters.city = { contains: city, mode: "insensitive" }
    if (department) filters.department = { contains: department, mode: "insensitive" }
    if (region) filters.region = { contains: region, mode: "insensitive" }
    if (postalCode) filters.postalCode = { startsWith: postalCode }
    if (landType) filters.landType = landType as LandType
    if (listingType) filters.listingType = listingType as ListingType
    if (minPrice || maxPrice) {
      filters.price = {}
      if (minPrice) filters.price.gte = Number(minPrice)
      if (maxPrice) filters.price.lte = Number(maxPrice)
    }
    if (minSurface || maxSurface) {
      filters.surface = {}
      if (minSurface) filters.surface.gte = Number(minSurface)
      if (maxSurface) filters.surface.lte = Number(maxSurface)
    }
    if (isServiced === "true") filters.isServiced = true
    if (isBuildable === "true") filters.isBuildable = true
    if (hasElectricity === "true") filters.hasElectricity = true
    if (hasWaterAccess === "true") filters.hasWaterAccess = true
    if (hasRoadAccess === "true") filters.hasRoadAccess = true
    if (isUrgent === "true") filters.isUrgent = true
    if (isExclusive === "true") filters.isExclusive = true

    const orderBy: Prisma.ListingOrderByWithRelationInput = {}
    const sortBy = searchParams.get("sortBy")
    switch (sortBy) {
      case "price_asc": orderBy.price = "asc"; break
      case "price_desc": orderBy.price = "desc"; break
      case "surface_asc": orderBy.surface = "asc"; break
      case "surface_desc": orderBy.surface = "desc"; break
      case "price_per_sqm_asc": orderBy.pricePerSqm = "asc"; break
      case "price_per_sqm_desc": orderBy.pricePerSqm = "desc"; break
      case "date_asc": orderBy.publishedAt = "asc"; break
      default: orderBy.publishedAt = "desc"
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where: filters,
        orderBy: [orderBy, { createdAt: "desc" }],
        skip,
        take: limit,
        select: {
          id: true, title: true, slug: true, price: true, surface: true,
          pricePerSqm: true, landType: true, listingType: true, city: true,
          department: true, postalCode: true, latitude: true, longitude: true,
          isFeatured: true, isUrgent: true, isExclusive: true, publishedAt: true,
          images: { select: { url: true, thumbnailUrl: true, isPrimary: true }, orderBy: { order: "asc" } },
          category: { select: { name: true, slug: true } },
        },
      }),
      prisma.listing.count({ where: filters }),
    ])

    return paginatedResponse(serializeListings(listings), total, page, limit)
  } catch (error) {
    console.error("GET /api/listings error:", error)
    return errorResponse("Erreur lors de la récupération des annonces", 500)
  }
}

export async function POST(request: NextRequest) {
  const { error: authError, session } = await requireAuth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR, UserRole.EDITOR])
  if (authError) return authError

  try {
    const body = await request.json()
    const { images: imageData, ...bodyFields } = body
    const validation = listingSchema.safeParse(bodyFields)
    if (!validation.success) {
      return errorResponse(validation.error.issues.map(e => e.message).join(", "))
    }

    const data = validation.data as any

    if (!data.categoryId) {
      data.categoryId = null
    }
    const slug = slugify(`${data.city}-${data.title}-${Date.now()}`)

    const listing = await prisma.listing.create({
      data: {
        ...data,
        slug,
        reference: generateReference(),
        pricePerSqm: data.surface > 0 ? Math.round(data.price / data.surface) : null,
        authorId: (session!.user as any).id,
        status: data.status || ListingStatus.DRAFT,
        publishedAt: (data.status === "PUBLISHED") ? new Date() : null,
        images: imageData?.length ? {
          createMany: { data: imageData.map((img: any) => ({ url: img.url, isPrimary: img.isPrimary, order: img.order })) },
        } : undefined,
      },
      include: {
        images: true,
        category: true,
      },
    })

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entityType: "Listing",
        entityId: listing.id,
        userId: (session!.user as any).id,
      },
    })

    if (data.status === "PUBLISHED") {
      createNotification({
        type: "listing",
        title: "Nouvelle annonce publiée",
        message: `« ${listing.title} » à ${listing.city} est maintenant en ligne`,
        link: `/admin/annonces/${listing.id}`,
        entityType: "Listing",
        entityId: listing.id,
      })
    }

    return successResponse(listing, 201)
  } catch (error) {
    console.error("POST /api/listings error:", error)
    return errorResponse("Erreur lors de la création de l'annonce", 500)
  }
}
