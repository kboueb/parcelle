import { prisma } from "./prisma"
import { PAGE_DEFAULTS, type PageKey } from "./page-content-defaults"

export type PageContentData = {
  title: string
  subtitle: string
  seoTitle: string
  seoDescription: string
  sections: Record<string, unknown>
}

function deepMerge(base: unknown, override: unknown): unknown {
  if (override === undefined || override === null) return base
  if (Array.isArray(base) || Array.isArray(override)) {
    return Array.isArray(override) ? override : base
  }
  if (typeof base === "object" && base !== null && typeof override === "object" && override !== null) {
    const merged: Record<string, unknown> = { ...(base as Record<string, unknown>) }
    for (const key of Object.keys(override as Record<string, unknown>)) {
      merged[key] = deepMerge((base as Record<string, unknown>)[key], (override as Record<string, unknown>)[key])
    }
    return merged
  }
  return override
}

export async function getPageContent(page: PageKey): Promise<PageContentData> {
  let db: {
    title: string | null
    subtitle: string | null
    content: unknown
    seoTitle: string | null
    seoDescription: string | null
  } | null = null

  try {
    const record = await prisma.pageContent.findUnique({ where: { page } })
    if (record && record.isActive) {
      db = {
        title: record.title,
        subtitle: record.subtitle,
        content: record.content,
        seoTitle: record.seoTitle,
        seoDescription: record.seoDescription,
      }
    }
  } catch {
    // Fall back to defaults
  }

  const defaults = PAGE_DEFAULTS[page] || {
    title: "",
    subtitle: "",
    seoTitle: "",
    seoDescription: "",
    sections: {},
  }

  const sections: Record<string, unknown> = {}
  for (const [key, defValue] of Object.entries(defaults.sections)) {
    sections[key] = deepMerge(defValue, (db?.content as Record<string, unknown> | undefined)?.[key])
  }

  return {
    title: db?.title || defaults.title || "",
    subtitle: db?.subtitle || defaults.subtitle || "",
    seoTitle: db?.seoTitle || defaults.seoTitle || "",
    seoDescription: db?.seoDescription || defaults.seoDescription || "",
    sections,
  }
}
