import { NextRequest, NextResponse } from "next/server"
import { requireAuth, successResponse, errorResponse } from "@/lib/api-helpers"
import { UserRole } from "@prisma/client"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuid } from "uuid"

export async function POST(request: NextRequest) {
  const { error: authError } = await requireAuth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR])
  if (authError) return authError

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) return errorResponse("Aucun fichier fourni")

    const folder = (formData.get("folder") as string | null) || "listings"
    const safeFolder = folder.replace(/[^a-zA-Z0-9-_]/g, "")

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = file.name.split(".").pop() || "jpg"
    const filename = `${uuid()}.${ext}`
    const dir = join(process.cwd(), "public", "uploads", safeFolder)
    const filepath = join(dir, filename)

    await mkdir(dir, { recursive: true })
    await writeFile(filepath, buffer)

    const url = `/uploads/${safeFolder}/${filename}`

    return successResponse({ url, name: file.name, size: file.size, mimeType: file.type }, 201)
  } catch (error) {
    console.error("Upload error:", error)
    return errorResponse("Erreur lors de l'upload", 500)
  }
}
