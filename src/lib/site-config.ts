import { prisma } from "./prisma"

export const DEFAULT_SITE_NAME = "Parcelles"

export type HeaderDisplay = "title" | "logo" | "both"

export type SiteConfig = {
  siteName: string
  siteLogoUrl: string
  headerDisplay: HeaderDisplay
}

let cachedConfig: SiteConfig | null = null
let cacheTime = 0
const CACHE_TTL = 60_000

const DEFAULT_CONFIG: SiteConfig = {
  siteName: DEFAULT_SITE_NAME,
  siteLogoUrl: "",
  headerDisplay: "both",
}

export async function getSiteConfig(): Promise<SiteConfig> {
  if (cachedConfig && Date.now() - cacheTime < CACHE_TTL) return cachedConfig
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: ["site_name", "site_logo_url", "header_display"] } },
    })
    const map: Record<string, string> = {}
    for (const s of settings) map[s.key] = s.value

    const display = map["header_display"]
    cachedConfig = {
      siteName: map["site_name"] || DEFAULT_SITE_NAME,
      siteLogoUrl: map["site_logo_url"] || "",
      headerDisplay: display === "title" || display === "logo" ? display : display === "both" ? "both" : "both",
    }
    cacheTime = Date.now()
    return cachedConfig
  } catch {
    return DEFAULT_CONFIG
  }
}
