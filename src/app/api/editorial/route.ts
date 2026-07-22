import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, requireAuth } from "@/lib/api-helpers"
import { UserRole } from "@prisma/client"

export async function GET() {
  try {
    const pages = await prisma.editorialPage.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    })
    return successResponse(pages)
  } catch (error) {
    return errorResponse("Erreur lors de la récupération des pages", 500)
  }
}

export async function POST(request: NextRequest) {
  const { error: authError, session } = await requireAuth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR])
  if (authError) return authError

  try {
    const body = await request.json()
    const page = await prisma.editorialPage.create({
      data: {
        ...body,
        authorId: (session!.user as any).id,
        publishedAt: body.isPublished ? new Date() : null,
      },
    })
    return successResponse(page, 201)
  } catch (error) {
    return errorResponse("Erreur lors de la création de la page", 500)
  }
}
