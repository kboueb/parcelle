import Link from "next/link"
import { prisma } from "@/lib/prisma"

const SECTION_TITLES: Record<string, string> = {
  acheter: "Acheter",
  villes: "Nos Villes",
  information: "Information",
}

const DEFAULT_LINKS: Record<string, { label: string; href: string }[]> = {
  acheter: [
    { label: "Terrain constructible", href: "/types/terrain-constructible" },
    { label: "Terrain agricole", href: "/types/terrain-agricole" },
    { label: "Terrain forestier", href: "/types/terrain-forestier" },
    { label: "Lotissement", href: "/types/lotissement" },
  ],
  villes: [
    { label: "Abidjan", href: "/villes/abidjan" },
    { label: "Bouaké", href: "/villes/bouake" },
    { label: "Yamoussoukro", href: "/villes/yamoussoukro" },
    { label: "Daloa", href: "/villes/daloa" },
    { label: "Korhogo", href: "/villes/korhogo" },
  ],
  information: [
    { label: "FAQ", href: "/faq" },
    { label: "Pages", href: "/pages" },
  ],
}

export async function Footer({ siteName = "Parcelles", siteLogoUrl = "" }: { siteName?: string; siteLogoUrl?: string }) {
  let links: { section: string; label: string; href: string }[] = []
  let description = "La plateforme de référence pour l'achat et la location de terrains et parcelles en Côte d'Ivoire."

  try {
    const [dbLinks, dbDesc] = await Promise.all([
      prisma.footerLink.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
      prisma.siteSetting.findUnique({ where: { key: "site_description" } }),
    ])
    links = dbLinks
    if (dbDesc) description = dbDesc.value
  } catch {
    // Fallback to defaults
  }

  const grouped: Record<string, { label: string; href: string }[]> = {}
  for (const link of links) {
    if (!grouped[link.section]) grouped[link.section] = []
    grouped[link.section].push({ label: link.label, href: link.href })
  }

  const sections = Object.keys(SECTION_TITLES).map(key => ({
    title: SECTION_TITLES[key],
    links: grouped[key]?.length ? grouped[key] : DEFAULT_LINKS[key] || [],
  }))

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              {siteLogoUrl ? (
                <img src={siteLogoUrl} alt={siteName} className="h-7 w-auto" />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600">
                  <span className="text-xs font-bold text-white">P</span>
                </div>
              )}
              <span className="text-lg font-bold text-gray-900">{siteName}</span>
            </div>
            <p className="text-sm text-gray-500">
              {description}
            </p>
          </div>
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} {siteName}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
