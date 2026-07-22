import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, requireAuth } from "@/lib/api-helpers"
import { UserRole, ListingStatus, ContactStatus } from "@prisma/client"

export async function GET() {
  const { error: authError } = await requireAuth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR])
  if (authError) return authError

  try {
    const [
      totalListings,
      activeListings,
      pendingListings,
      expiredListings,
      draftListings,
      totalLeads,
      newLeads,
      totalViews,
      totalFavorites,
      totalAlerts,
      totalUsers,
      recentListings,
      recentLeads,
      listingsByType,
      listingsByLandType,
    ] = await Promise.all([
      prisma.listing.count(),
      prisma.listing.count({ where: { status: ListingStatus.PUBLISHED } }),
      prisma.listing.count({ where: { status: ListingStatus.PENDING_REVIEW } }),
      prisma.listing.count({ where: { status: ListingStatus.EXPIRED } }),
      prisma.listing.count({ where: { status: ListingStatus.DRAFT } }),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: ContactStatus.NEW } }),
      prisma.listing.aggregate({ _sum: { viewCount: true } }),
      prisma.favorite.count(),
      prisma.alert.count(),
      prisma.user.count(),
      prisma.listing.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, slug: true, status: true, price: true, city: true, createdAt: true } }),
      prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { listing: { select: { title: true } } } }),
      prisma.listing.groupBy({ by: ["listingType"], _count: true }),
      prisma.listing.groupBy({ by: ["landType"], _count: true, where: { status: ListingStatus.PUBLISHED } }),
    ])

    return successResponse({
      overview: {
        totalListings,
        activeListings,
        pendingListings,
        expiredListings,
        draftListings,
        totalLeads,
        newLeads,
        totalViews: totalViews._sum.viewCount || 0,
        totalFavorites,
        totalAlerts,
        totalUsers,
      },
      recentListings,
      recentLeads,
      listingsByType,
      listingsByLandType,
    })
  } catch (error) {
    return errorResponse("Erreur lors de la récupération des statistiques", 500)
  }
}
