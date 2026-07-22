import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
})

export const listingSchema = z.object({
  title: z.string().min(5, "Titre trop court").max(200, "Titre trop long"),
  description: z.string().min(20, "Description trop courte"),
  shortDescription: z.string().max(300).optional(),
  price: z.coerce.number().positive("Prix invalide"),
  rentalPrice: z.coerce.number().positive().optional(),
  surface: z.coerce.number().positive("Surface invalide"),
  landType: z.enum(["BUILDABLE", "SERVICED", "AGRICULTURAL", "FOREST", "SUBDIVISION", "NON_BUILDABLE", "COMMERCIAL", "INDUSTRIAL", "RURAL", "OTHER"]),
  listingType: z.enum(["SELL", "RENT"]).default("SELL"),
  address: z.string().min(5, "Adresse invalide"),
  city: z.string().min(2, "Ville invalide"),
  postalCode: z.string().regex(/^\d{5}$/, "Code postal invalide"),
  department: z.string().min(1),
  departmentCode: z.string().min(1),
  region: z.string().min(1),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  isServiced: z.boolean().optional(),
  isBuildable: z.boolean().optional(),
  isFenced: z.boolean().optional(),
  hasWaterAccess: z.boolean().optional(),
  hasElectricity: z.boolean().optional(),
  hasRoadAccess: z.boolean().optional(),
  isFlat: z.boolean().optional(),
  reference: z.string().optional(),
  cadastralRef: z.string().optional(),
  lotNumber: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isUrgent: z.boolean().optional(),
  isExclusive: z.boolean().optional(),
  status: z.enum(["DRAFT", "PENDING_REVIEW", "PUBLISHED", "ARCHIVED", "EXPIRED", "REJECTED"]).optional(),
  categoryId: z.string().optional(),
})

export const contactSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message trop court"),
  listingId: z.string(),
})

export const alertSchema = z.object({
  email: z.string().email("Email invalide"),
  filters: z.object({}).passthrough(),
  frequency: z.enum(["instant", "daily", "weekly", "monthly"]).default("daily"),
})

export const reportSchema = z.object({
  reason: z.enum(["FRAUD", "DUPLICATE", "INVALID_CONTENT", "EXPIRED", "WRONG_INFO", "OTHER"]),
  description: z.string().optional(),
})

export const filtersSchema = z.object({
  q: z.string().optional(),
  city: z.string().optional(),
  department: z.string().optional(),
  departmentCode: z.string().optional(),
  region: z.string().optional(),
  postalCode: z.string().optional(),
  landType: z.string().optional(),
  listingType: z.enum(["SELL", "RENT"]).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minSurface: z.coerce.number().optional(),
  maxSurface: z.coerce.number().optional(),
  minPricePerSqm: z.coerce.number().optional(),
  maxPricePerSqm: z.coerce.number().optional(),
  isServiced: z.coerce.boolean().optional(),
  isBuildable: z.coerce.boolean().optional(),
  hasElectricity: z.coerce.boolean().optional(),
  hasWaterAccess: z.coerce.boolean().optional(),
  hasRoadAccess: z.coerce.boolean().optional(),
  isUrgent: z.coerce.boolean().optional(),
  isExclusive: z.coerce.boolean().optional(),
  sortBy: z.enum(["price_asc", "price_desc", "surface_asc", "surface_desc", "date_desc", "date_asc", "price_per_sqm_asc", "price_per_sqm_desc"]).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(24),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radius: z.coerce.number().optional(),
})

export const editorialPageSchema = z.object({
  title: z.string().min(5, "Titre trop court"),
  content: z.string().min(20, "Contenu trop court"),
  excerpt: z.string().optional(),
  isPublished: z.boolean().default(false),
})

export const faqSchema = z.object({
  question: z.string().min(5, "Question trop courte"),
  answer: z.string().min(10, "Réponse trop courte"),
  category: z.string().optional(),
  order: z.coerce.number().default(0),
  isPublished: z.boolean().default(true),
})

export const bannerSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().optional(),
  linkUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.coerce.number().default(0),
})
