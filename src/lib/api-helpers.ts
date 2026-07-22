import { NextResponse } from "next/server"
import { auth } from "./auth"
import { UserRole } from "@prisma/client"

export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function errorResponse(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status })
}

export function paginatedResponse<T>(data: T, total: number, page: number, limit: number) {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}

export async function requireAuth(allowedRoles?: UserRole[]) {
  const session = await auth()
  if (!session?.user) {
    return { error: errorResponse("Non authentifié", 401), session: null }
  }
  if (allowedRoles && session.user) {
    const userRole = (session.user as any).role as UserRole
    if (!allowedRoles.includes(userRole)) {
      return { error: errorResponse("Permission insuffisante", 403), session: null }
    }
  }
  return { error: null, session }
}
