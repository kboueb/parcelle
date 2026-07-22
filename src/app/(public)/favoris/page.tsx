"use client"

import { useState, useEffect, useCallback } from "react"
import { ListingCard } from "@/components/public/ListingCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { ListingCardData } from "@/types"

type FavoriteItem = {
  id: string
  listingId: string
  createdAt: string
  listing: ListingCardData
}

function getVisitorId(): string {
  if (typeof window === "undefined") return ""
  return localStorage.getItem("visitor_id") || ""
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    const visitorId = getVisitorId()
    if (!visitorId) {
      setIsLoading(false)
      return
    }
    try {
      const res = await fetch("/api/favorites", {
        headers: { "x-visitor-id": visitorId },
      })
      const data = await res.json()
      if (data.success) setFavorites(data.data)
    } catch {
      // silently fail
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const remove = async (listingId: string) => {
    const visitorId = getVisitorId()
    const res = await fetch("/api/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-visitor-id": visitorId },
      body: JSON.stringify({ listingId }),
    })
    const data = await res.json()
    if (data.success) setFavorites(prev => prev.filter(f => f.listingId !== listingId))
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Heart className="h-6 w-6 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-900">Mes favoris</h1>
        </div>
        <p className="text-gray-500 mt-2">
          {favorites.length > 0
            ? `${favorites.length} annonce${favorites.length > 1 ? "s" : ""} sauvegardée${favorites.length > 1 ? "s" : ""}`
            : "Retrouvez vos annonces favorites"}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
              <Skeleton className="aspect-[4/3] rounded-none" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun favori</h3>
          <p className="text-gray-500 mb-6">Vous n&apos;avez pas encore ajouté d&apos;annonces à vos favoris</p>
          <Link href="/recherche">
            <Button className="bg-emerald-600 hover:bg-emerald-700">Explorer les annonces</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((fav) => (
            <div key={fav.id} className="relative group">
              <ListingCard listing={fav.listing} />
              <button
                onClick={() => remove(fav.listingId)}
                className="absolute top-2 left-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Retirer des favoris"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
