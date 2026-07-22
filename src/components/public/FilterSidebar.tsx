"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { LAND_TYPE_OPTIONS } from "@/lib/constants"

export function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentLandType = searchParams.get("landType") || ""
  const currentListingType = searchParams.get("listingType") || "SELL"
  const currentMinPrice = searchParams.get("minPrice") || ""
  const currentMaxPrice = searchParams.get("maxPrice") || ""
  const currentMinSurface = searchParams.get("minSurface") || ""
  const currentMaxSurface = searchParams.get("maxSurface") || ""

  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set("page", "1")
    router.push(`/recherche?${params.toString()}`)
  }, [router, searchParams])

  const clearFilters = useCallback(() => {
    router.push("/recherche")
  }, [router])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filtres</h3>
        <button onClick={clearFilters} className="text-xs text-emerald-600 hover:text-emerald-700">
          Réinitialiser
        </button>
      </div>

      <Separator />

      <div>
        <Label className="text-sm font-medium mb-2 block">Type d&apos;annonce</Label>
        <div className="flex gap-2">
          <Button
            variant={currentListingType === "SELL" ? "default" : "outline"}
            size="sm"
            onClick={() => updateFilter("listingType", "SELL")}
          >
            Vente
          </Button>
          <Button
            variant={currentListingType === "RENT" ? "default" : "outline"}
            size="sm"
            onClick={() => updateFilter("listingType", "RENT")}
          >
            Location
          </Button>
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-sm font-medium mb-2 block">Type de terrain</Label>
        <Select value={currentLandType} onValueChange={(v) => updateFilter("landType", v === "all" ? "" : v)}>
          <SelectTrigger>
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {LAND_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <Label className="text-sm font-medium mb-2 block">Prix (FCFA)</Label>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            placeholder="Min"
            value={currentMinPrice}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
            className="h-9"
          />
          <span className="text-gray-400">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={currentMaxPrice}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
            className="h-9"
          />
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-sm font-medium mb-2 block">Surface (m²)</Label>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            placeholder="Min"
            value={currentMinSurface}
            onChange={(e) => updateFilter("minSurface", e.target.value)}
            className="h-9"
          />
          <span className="text-gray-400">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={currentMaxSurface}
            onChange={(e) => updateFilter("maxSurface", e.target.value)}
            className="h-9"
          />
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-sm font-medium mb-3 block">Critères</Label>
        <div className="space-y-2">
          {[
            { key: "isServiced", label: "Viabilisé" },
            { key: "isBuildable", label: "Constructible" },
            { key: "hasElectricity", label: "Électricité" },
            { key: "hasWaterAccess", label: "Accès à l'eau" },
            { key: "hasRoadAccess", label: "Accès routier" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={searchParams.get(key) === "true"}
                onCheckedChange={(checked) => updateFilter(key, checked ? "true" : "")}
              />
              <span className="text-sm text-gray-600">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
