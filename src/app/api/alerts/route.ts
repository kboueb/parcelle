import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-helpers"

function getVisitorId(request: NextRequest): string {
  return request.headers.get("x-visitor-id") || request.cookies.get("visitor_id")?.value || "anonymous"
}

export async function GET(request: NextRequest) {
  const visitorId = getVisitorId(request)
  try {
    const alerts = await prisma.alert.findMany({
      where: { visitorId },
      orderBy: { createdAt: "desc" },
    })
    return successResponse(alerts)
  } catch (error) {
    return errorResponse("Erreur lors de la récupération des alertes", 500)
  }
}

export async function POST(request: NextRequest) {
  const visitorId = getVisitorId(request)
  try {
    const body = await request.json()
    const alert = await prisma.alert.create({
      data: {
        visitorId,
        email: body.email,
        filters: body.filters || {},
        frequency: body.frequency || "daily",
      },
    })
    return successResponse(alert, 201)
  } catch (error) {
    return errorResponse("Erreur lors de la création de l'alerte", 500)
  }
}
