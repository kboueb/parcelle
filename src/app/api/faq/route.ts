import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, requireAuth } from "@/lib/api-helpers"
import { UserRole } from "@prisma/client"

export async function GET() {
  try {
    const faqs = await prisma.faqEntry.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    })
    return successResponse(faqs)
  } catch (error) {
    return errorResponse("Erreur lors de la récupération des FAQ", 500)
  }
}

export async function POST(request: NextRequest) {
  const { error: authError } = await requireAuth([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  if (authError) return authError

  try {
    const body = await request.json()
    const faq = await prisma.faqEntry.create({ data: body })
    return successResponse(faq, 201)
  } catch (error) {
    return errorResponse("Erreur lors de la création de la FAQ", 500)
  }
}
