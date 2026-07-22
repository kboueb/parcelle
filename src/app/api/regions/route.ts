import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, requireAuth } from "@/lib/api-helpers"
import { UserRole } from "@prisma/client"
import { slugify } from "@/lib/utils"

export async function GET() {
  try {
    const regions = await prisma.region.findMany({
      orderBy: { order: "asc" },
    })
    return successResponse(regions)
  } catch (error) {
    return errorResponse("Erreur lors de la récupération des régions", 500)
  }
}

export async function POST(request: NextRequest) {
  const { error: authError } = await requireAuth([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  if (authError) return authError

  try {
    const body = await request.json()
    const region = await prisma.region.create({
      data: {
        name: body.name,
        slug: slugify(body.name),
        isActive: body.isActive ?? true,
        order: body.order ?? 0,
      },
    })
    return successResponse(region, 201)
  } catch (error: any) {
    if (error?.code === "P2002") {
      return errorResponse("Une région avec ce nom existe déjà")
    }
    return errorResponse("Erreur lors de la création de la région", 500)
  }
}
