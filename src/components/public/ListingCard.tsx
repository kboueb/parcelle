"use client"

import Link from "next/link"
import { MapPin, Maximize2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatSurface } from "@/lib/utils"
import { LAND_TYPE_LABELS } from "@/lib/constants"
import { FavoriteButton } from "./FavoriteButton"
import type { ListingCardData } from "@/types"

type Props = {
  listing: ListingCardData
}

export function ListingCard({ listing }: Props) {
  const primaryImage = listing.images.find(img => img.isPrimary) || listing.images[0]

  return (
    <Link href={`/terrain/${listing.slug}`} className="group block">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-emerald-200">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {primaryImage ? (
            <img
              src={primaryImage.thumbnailUrl || primaryImage.url}
              alt={listing.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <Maximize2 className="h-8 w-8" />
            </div>
          )}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {listing.isFeatured && (
              <Badge variant="primary">En avant</Badge>
            )}
            {listing.isUrgent && (
              <Badge variant="destructive">Urgent</Badge>
            )}
            {listing.isExclusive && (
              <Badge variant="secondary">Exclusif</Badge>
            )}
          </div>
          <div className="absolute top-2 right-2">
            <FavoriteButton listingId={listing.id} />
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
              {listing.title}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{listing.city} ({listing.postalCode})</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <span>{formatSurface(listing.surface)}</span>
            <span className="text-gray-300">·</span>
            <Badge variant="outline" className="text-xs">
              {LAND_TYPE_LABELS[listing.landType] || listing.landType}
            </Badge>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-emerald-600">
              {formatPrice(Number(listing.price))}
            </span>
            {listing.pricePerSqm && (
              <span className="text-xs text-gray-400">
                {formatPrice(Number(listing.pricePerSqm))}/m²
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
