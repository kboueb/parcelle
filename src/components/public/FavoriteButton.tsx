"use client"

import { useState, useEffect, useCallback } from "react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

function getVisitorId(): string {
  if (typeof window === "undefined") return ""
  let id = localStorage.getItem("visitor_id")
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem("visitor_id", id)
  }
  return id
}

type Props = {
  listingId: string
  className?: string
  size?: "sm" | "md"
}

export function FavoriteButton({ listingId, className, size = "sm" }: Props) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const visitorId = getVisitorId()
    if (!visitorId) return
    fetch("/api/favorites", {
      headers: { "x-visitor-id": visitorId },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setIsFavorite(data.data.some((f: any) => f.listingId === listingId))
        }
      })
      .catch(() => {})
  }, [listingId])

  const toggle = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return

    const visitorId = getVisitorId()
    setLoading(true)

    try {
      if (isFavorite) {
        const res = await fetch("/api/favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json", "x-visitor-id": visitorId },
          body: JSON.stringify({ listingId }),
        })
        const data = await res.json()
        if (data.success) setIsFavorite(false)
      } else {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-visitor-id": visitorId },
          body: JSON.stringify({ listingId }),
        })
        const data = await res.json()
        if (data.success) setIsFavorite(true)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [listingId, isFavorite, loading])

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5"
  const btnSize = size === "sm" ? "h-8 w-8" : "h-10 w-10"

  return (
    <button
      onClick={toggle}
      disabled={loading}
      suppressHydrationWarning
      className={cn(
        "flex items-center justify-center rounded-full backdrop-blur-sm transition-colors",
        btnSize,
        size === "sm"
          ? "bg-white/80 hover:bg-white"
          : "bg-white shadow-md hover:shadow-lg",
        className
      )}
      aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart
        suppressHydrationWarning
        className={cn(
          iconSize,
          "transition-colors",
          isFavorite
            ? "fill-red-500 text-red-500"
            : "text-gray-600 hover:text-red-400"
        )}
      />
    </button>
  )
}
