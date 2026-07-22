export const SITE_DESCRIPTION = "La plateforme de référence pour l'achat et la location de terrains et parcelles en France"
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://parcelles.fr"
export const SITE_LOGO = "/images/logo.svg"

export const ITEMS_PER_PAGE = 24
export const ITEMS_PER_PAGE_ADMIN = 50

export const LAND_TYPE_LABELS: Record<string, string> = {
  BUILDABLE: "Constructible",
  SERVICED: "Viabilisé",
  AGRICULTURAL: "Agricole",
  FOREST: "Forestier",
  SUBDIVISION: "Lotissement",
  NON_BUILDABLE: "Non constructible",
  COMMERCIAL: "Commercial",
  INDUSTRIAL: "Industriel",
  RURAL: "Rural",
  OTHER: "Autre",
}

export const LAND_TYPE_OPTIONS = [
  { value: "BUILDABLE", label: "Constructible" },
  { value: "SERVICED", label: "Viabilisé" },
  { value: "AGRICULTURAL", label: "Agricole" },
  { value: "FOREST", label: "Forestier" },
  { value: "SUBDIVISION", label: "Lotissement" },
  { value: "NON_BUILDABLE", label: "Non constructible" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "INDUSTRIAL", label: "Industriel" },
  { value: "RURAL", label: "Rural" },
  { value: "OTHER", label: "Autre" },
]

export const LISTING_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Brouillon",
  PENDING_REVIEW: "En attente",
  PUBLISHED: "Publiée",
  ARCHIVED: "Archivée",
  EXPIRED: "Expirée",
  REJECTED: "Rejetée",
}

export const CONTACT_STATUS_LABELS: Record<string, string> = {
  NEW: "Nouveau",
  READ: "Lu",
  REPLIED: "Répondu",
  ARCHIVED: "Archivé",
  SPAM: "Spam",
}

export const REPORT_REASON_LABELS: Record<string, string> = {
  FRAUD: "Fraude",
  DUPLICATE: "Doublon",
  INVALID_CONTENT: "Contenu invalide",
  EXPIRED: "Annonce expirée",
  WRONG_INFO: "Informations erronées",
  OTHER: "Autre",
}

export const FRENCH_REGIONS = [
  "Auvergne-Rhône-Alpes",
  "Bourgogne-Franche-Comté",
  "Bretagne",
  "Centre-Val de Loire",
  "Corse",
  "Grand Est",
  "Hauts-de-France",
  "Île-de-France",
  "Normandie",
  "Nouvelle-Aquitaine",
  "Occitanie",
  "Pays de la Loire",
  "Provence-Alpes-Côte d'Azur",
  "Guadeloupe",
  "Martinique",
  "Guyane",
  "La Réunion",
  "Mayotte",
]

export const ALERT_FREQUENCIES = [
  { value: "instant", label: "Immédiat" },
  { value: "daily", label: "Quotidien" },
  { value: "weekly", label: "Hebdomadaire" },
  { value: "monthly", label: "Mensuel" },
]

export const SURFACE_RANGES = [
  { value: "0-500", label: "Moins de 500 m²" },
  { value: "500-1000", label: "500 - 1 000 m²" },
  { value: "1000-5000", label: "1 000 - 5 000 m²" },
  { value: "5000-10000", label: "5 000 - 10 000 m²" },
  { value: "10000-50000", label: "1 - 5 ha" },
  { value: "50000-9999999", label: "Plus de 5 ha" },
]

export const PRICE_RANGES = [
  { value: "0-5000000", label: "Moins de 5 000 000 FCFA" },
  { value: "5000000-10000000", label: "5 000 000 - 10 000 000 FCFA" },
  { value: "10000000-50000000", label: "10 000 000 - 50 000 000 FCFA" },
  { value: "50000000-100000000", label: "50 000 000 - 100 000 000 FCFA" },
  { value: "100000000-500000000", label: "100 000 000 - 500 000 000 FCFA" },
  { value: "500000000-999999999999", label: "Plus de 500 000 000 FCFA" },
]
