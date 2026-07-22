import { prisma } from "./prisma"

const DEFAULT_SITE_NAME = "Parcelles"

let cachedSiteName: string | null = null
let cacheTime = 0
const CACHE_TTL = 60_000

export async function getSiteName(): Promise<string> {
  if (cachedSiteName && Date.now() - cacheTime < CACHE_TTL) return cachedSiteName
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "site_name" } })
    if (setting?.value) {
      cachedSiteName = setting.value
      cacheTime = Date.now()
      return setting.value
    }
  } catch {}
  return DEFAULT_SITE_NAME
}
