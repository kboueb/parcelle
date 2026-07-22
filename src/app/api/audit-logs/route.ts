import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, requireAuth } from "@/lib/api-helpers"
import { UserRole } from "@prisma/client"

export async function GET() {
  const { error: authError } = await requireAuth([UserRole.SUPER_ADMIN])
  if (authError) return authError

  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { user: { select: { name: true, email: true } } },
    })
    return successResponse(logs)
  } catch (error) {
    return errorResponse("Erreur lors de la récupération des logs", 500)
  }
}
