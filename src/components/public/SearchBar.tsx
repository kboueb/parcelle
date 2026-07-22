"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LAND_TYPE_OPTIONS } from "@/lib/constants"

export function SearchBar({ variant = "default" }: { variant?: "default" | "hero" }) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [landType, setLandType] = useState("")
  const [listingType, setListingType] = useState("SELL")

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (landType) params.set("landType", landType)
    if (listingType) params.set("listingType", listingType)
    router.push(`/recherche?${params.toString()}`)
  }, [query, landType, listingType, router])

  if (variant === "hero") {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ville, département, code postal..."
              className="pl-10 h-12 text-base bg-white border-gray-300"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Select value={landType} onValueChange={setLandType}>
            <SelectTrigger className="h-12 w-full sm:w-44 bg-white">
              <SelectValue placeholder="Type de terrain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              {LAND_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="xl" onClick={handleSearch} className="gap-2">
            <Search className="h-5 w-5" />
            Rechercher
          </Button>
        </div>
        <div className="flex gap-4 mt-3 justify-center">
          <button
            onClick={() => { setListingType("SELL"); handleSearch() }}
            className="text-sm text-white/80 hover:text-white underline underline-offset-4"
          >
            Acheter un terrain
          </button>
          <button
            onClick={() => { setListingType("RENT"); handleSearch() }}
            className="text-sm text-white/80 hover:text-white underline underline-offset-4"
          >
            Louer un terrain
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ville, département..."
          className="pl-9"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>
      <Select value={landType} onValueChange={setLandType}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous</SelectItem>
          {LAND_TYPE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleSearch} size="icon">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  )
}
