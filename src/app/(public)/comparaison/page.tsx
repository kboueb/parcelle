"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice, formatSurface } from "@/lib/utils"
import { LAND_TYPE_LABELS } from "@/lib/constants"
import { X, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ComparisonPage() {
  const [comparisons, setComparisons] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const visitorId = localStorage.getItem("visitor_id") || crypto.randomUUID()
    localStorage.setItem("visitor_id", visitorId)

    fetch("/api/comparisons", {
      headers: { "x-visitor-id": visitorId },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setComparisons(data.data)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const removeComparison = async (listingId: string) => {
    const visitorId = localStorage.getItem("visitor_id")
    const res = await fetch("/api/comparisons", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-visitor-id": visitorId || "" },
      body: JSON.stringify({ listingId }),
    })
    const data = await res.json()
    if (data.success) {
      setComparisons(prev => prev.filter(c => c.listingId !== listingId))
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-900">Comparaison</h1>
        </div>
        <p className="text-gray-500 mt-2">Comparez jusqu&apos;à 5 annonces côte à côte</p>
      </div>

      {isLoading ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 pr-4 text-left w-40"><Skeleton className="h-4 w-16" /></th>
                {Array.from({ length: 3 }).map((_, i) => (
                  <th key={i} className="py-3 px-4 min-w-[200px]">
                    <Skeleton className="aspect-[4/3] w-full rounded-lg mb-2" />
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {["Prix", "Surface", "Prix/m²", "Type", "Ville", "Département"].map((label) => (
                <tr key={label} className="border-b border-gray-100">
                  <td className="py-3 pr-4"><Skeleton className="h-4 w-16" /></td>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <td key={i} className="py-3 px-4 text-center"><Skeleton className="h-4 w-20 mx-auto" /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : comparisons.length === 0 ? (
        <div className="text-center py-16">
          <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune annonce à comparer</h3>
          <p className="text-gray-500 mb-4">Ajoutez des annonces pour les comparer</p>
          <Link href="/recherche">
            <Button>Rechercher des terrains</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 pr-4 text-left font-medium text-gray-500 w-40">Critère</th>
                {comparisons.map((c: any) => (
                  <th key={c.listingId} className="py-3 px-4 text-center min-w-[200px]">
                    <div className="relative">
                      <button
                        onClick={() => removeComparison(c.listingId)}
                        className="absolute -top-1 -right-2 p-1 rounded-full hover:bg-gray-100 text-gray-400"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {c.listing.images?.[0] && (
                        <img src={c.listing.images[0].thumbnailUrl || c.listing.images[0].url} alt="" className="w-full aspect-[4/3] object-cover rounded-lg mb-2" />
                      )}
                      <Link href={`/terrain/${c.listing.slug}`} className="font-medium text-gray-900 hover:text-emerald-600">
                        {c.listing.title}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Prix", render: (l: any) => formatPrice(Number(l.price)) },
                { label: "Surface", render: (l: any) => formatSurface(Number(l.surface)) },
                { label: "Prix/m²", render: (l: any) => l.pricePerSqm ? formatPrice(Number(l.pricePerSqm)) : "N/A" },
                { label: "Type", render: (l: any) => LAND_TYPE_LABELS[l.landType] || l.landType },
                { label: "Ville", render: (l: any) => l.city },
                { label: "Département", render: (l: any) => l.department },
              ].map((row) => (
                <tr key={row.label} className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium text-gray-600">{row.label}</td>
                  {comparisons.map((c: any) => (
                    <td key={c.listingId} className="py-3 px-4 text-center text-gray-900">{row.render(c.listing)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
