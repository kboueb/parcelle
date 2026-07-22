export type ListingFilters = {
  q?: string
  city?: string
  department?: string
  departmentCode?: string
  region?: string
  postalCode?: string
  landType?: string
  listingType?: "SELL" | "RENT"
  minPrice?: number
  maxPrice?: number
  minSurface?: number
  maxSurface?: number
  minPricePerSqm?: number
  maxPricePerSqm?: number
  isServiced?: boolean
  isBuildable?: boolean
  hasElectricity?: boolean
  hasWaterAccess?: boolean
  hasRoadAccess?: boolean
  isUrgent?: boolean
  isExclusive?: boolean
  sortBy?: string
  page?: number
  limit?: number
  lat?: number
  lng?: number
  radius?: number
}

export type ListingCardData = {
  id: string
  title: string
  slug: string
  price: number
  surface: number
  pricePerSqm: number | null
  landType: string
  listingType: string
  city: string
  department: string
  postalCode: string
  latitude: number | null
  longitude: number | null
  isFeatured: boolean
  isUrgent: boolean
  isExclusive: boolean
  publishedAt: string | null
  images: { url: string; thumbnailUrl: string | null; isPrimary: boolean }[]
  category?: { name: string; slug: string } | null
}

export type ListingDetailData = ListingCardData & {
  description: string
  shortDescription: string | null
  address: string
  region: string
  departmentCode: string
  rentalPrice: number | null
  reference: string | null
  cadastralRef: string | null
  lotNumber: string | null
  isServiced: boolean
  isBuildable: boolean
  isFenced: boolean
  hasWaterAccess: boolean
  hasElectricity: boolean
  hasRoadAccess: boolean
  isFlat: boolean
  coefOccupation: number | null
  floorAreaRatio: number | null
  maxHeight: number | null
  minDivision: number | null
  viewCount: number
  contactCount: number
  status: string
  documents: { name: string; url: string }[]
  seoMetadata?: {
    title: string | null
    description: string | null
  } | null
}

export type BreadcrumbItem = {
  label: string
  href?: string
}

export type NavItem = {
  label: string
  href: string
  children?: NavItem[]
}

export type StatsCard = {
  label: string
  value: number | string
  change?: number
  icon: string
}
