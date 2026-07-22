import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { successResponse, errorResponse } from "@/lib/api-helpers"
import { UserRole, ListingStatus, LandType, ListingType } from "@prisma/client"

export async function POST() {
  try {
    const adminPassword = await hash("admin123", 12)

    const admin = await prisma.user.upsert({
      where: { email: "admin@parcelles.fr" },
      update: {},
      create: {
        email: "admin@parcelles.fr",
        passwordHash: adminPassword,
        name: "Admin Parcelles",
        role: UserRole.SUPER_ADMIN,
        isActive: true,
      },
    })

    const categories = [
      { name: "Terrain constructible", slug: "terrain-constructible", description: "Terrain sur lequel la construction est autorisée", order: 1 },
      { name: "Terrain viabilisé", slug: "terrain-viabilise", description: "Terrain raccordé aux réseaux", order: 2 },
      { name: "Terrain agricole", slug: "terrain-agricole", description: "Terrain destiné à l'exploitation agricole", order: 3 },
      { name: "Terrain forestier", slug: "terrain-forestier", description: "Terrain boisé et forestier", order: 4 },
      { name: "Lotissement", slug: "lotissement", description: "Terrain divisé en lots", order: 5 },
      { name: "Terrain non constructible", slug: "terrain-non-constructible", description: "Terrain sans droit de construire", order: 6 },
    ]

    for (const cat of categories) {
      await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat })
    }

    const sampleListings = [
      {
        title: "Magnifique terrain constructible avec vue dégagée",
        description: "Superbe terrain constructible de 850 m² situé dans un quartier calme et résidentiel. Idéal pour la construction d'une maison individuelle. Proche des écoles, commerces et transports en commun. Terrain plat, viabilisé en bordure de voie.",
        price: 145000,
        surface: 850,
        landType: LandType.BUILDABLE,
        listingType: ListingType.SELL,
        city: "Lyon",
        department: "Rhône",
        departmentCode: "69",
        region: "Auvergne-Rhône-Alpes",
        postalCode: "69003",
        address: "15 Rue des Jardins",
        latitude: 45.7578,
        longitude: 4.8352,
        isServiced: true,
        isBuildable: true,
        isFlat: true,
        hasElectricity: true,
        hasWaterAccess: true,
        hasRoadAccess: true,
        isFeatured: true,
        status: ListingStatus.PUBLISHED,
        publishedAt: new Date("2025-12-15"),
      },
      {
        title: "Terrain agricole de 2,5 hectares en zone fertile",
        description: "Belle parcelle agricole de 2,5 hectares située en pleine zone agricole. Terre fertile idéale pour les cultures maraîchères ou céréalières. Accès facile par chemin rural. Point d'eau naturel sur la parcelle.",
        price: 78000,
        surface: 25000,
        landType: LandType.AGRICULTURAL,
        listingType: ListingType.SELL,
        city: "Bordeaux",
        department: "Gironde",
        departmentCode: "33",
        region: "Nouvelle-Aquitaine",
        postalCode: "33000",
        address: "Chemin des Vignes",
        latitude: 44.8378,
        longitude: -0.5792,
        isServiced: false,
        isBuildable: false,
        hasWaterAccess: true,
        hasRoadAccess: true,
        status: ListingStatus.PUBLISHED,
        publishedAt: new Date("2025-12-20"),
      },
      {
        title: "Lotissement de 6 lots constructibles",
        description: "Lotissement de 6 terrains constructibles viabilisés. Chaque lot fait entre 400 et 600 m². Tous les lots sont viabilisés (eau, électricité, assainissement). Accès goudronné. Idéal pour promoteur ou construction individuelle.",
        price: 480000,
        surface: 3000,
        landType: LandType.SUBDIVISION,
        listingType: ListingType.SELL,
        city: "Toulouse",
        department: "Haute-Garonne",
        departmentCode: "31",
        region: "Occitanie",
        postalCode: "31000",
        address: "Avenue du Lotissement",
        latitude: 43.6047,
        longitude: 1.4442,
        isServiced: true,
        isBuildable: true,
        hasElectricity: true,
        hasWaterAccess: true,
        hasRoadAccess: true,
        isFlat: true,
        isFeatured: true,
        isExclusive: true,
        status: ListingStatus.PUBLISHED,
        publishedAt: new Date("2026-01-05"),
      },
    ]

    for (const listing of sampleListings) {
      const pricePerSqm = Math.round(listing.price / listing.surface)

      const existing = await prisma.listing.findFirst({ where: { title: listing.title } })
      if (!existing) {
        const slug = `${listing.city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}-${listing.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").substring(0, 50)}-${Date.now()}`
        await prisma.listing.create({
          data: {
            ...listing as any,
            slug,
            pricePerSqm,
            authorId: admin.id,
            reference: `PAR-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          },
        })
      }
    }

    const faqEntries = [
      { question: "Comment acheter un terrain constructible ?", answer: "L'achat d'un terrain constructible nécessite de vérifier le PLU de la commune, de s'assurer que le terrain est raccordable aux réseaux et d'obtenir un certificat d'urbanisme.", category: "Achat", order: 1 },
      { question: "Quelle est la différence entre un terrain viabilisé et non viabilisé ?", answer: "Un terrain viabilisé est raccordé aux réseaux publics (eau, électricité, gaz, assainissement). Un terrain non viabilisé nécessite des travaux de raccordement.", category: "Achat", order: 2 },
      { question: "Comment estimer le prix d'un terrain ?", answer: "Le prix dépend de la localisation, la surface, le classement PLU, la présence de réseaux, la topographie et les prix du marché local.", category: "Estimation", order: 3 },
    ]

    for (const faq of faqEntries) {
      await prisma.faqEntry.upsert({
        where: { id: "faq-seed-" + faq.order },
        update: {},
        create: { id: "faq-seed-" + faq.order, ...faq },
      })
    }

    const regions = [
      { name: "Lagunes", order: 1 },
      { name: "Haut-Sassandra", order: 2 },
      { name: "Sassandra-Marahoué", order: 3 },
      { name: "Vallée du Bandama", order: 4 },
      { name: "Gôh-Djiboua", order: 5 },
      { name: "Lacs", order: 6 },
      { name: "Comoé", order: 7 },
      { name: "Mara-Haut-Bandama", order: 8 },
      { name: "Béré", order: 9 },
      { name: "Savanes", order: 10 },
      { name: "Dix-Huit Montagnes", order: 11 },
      { name: "Moyen-Cavally", order: 12 },
      { name: "Fromager", order: 13 },
      { name: "Nzi-Comoé", order: 14 },
    ]

    for (const region of regions) {
      await prisma.region.upsert({
        where: { name: region.name },
        update: {},
        create: { name: region.name, slug: region.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), order: region.order },
      })
    }

    const footerLinks = [
      { section: "acheter", label: "Terrain constructible", href: "/types/terrain-constructible", order: 1 },
      { section: "acheter", label: "Terrain agricole", href: "/types/terrain-agricole", order: 2 },
      { section: "acheter", label: "Terrain forestier", href: "/types/terrain-forestier", order: 3 },
      { section: "acheter", label: "Lotissement", href: "/types/lotissement", order: 4 },
      { section: "villes", label: "Abidjan", href: "/villes/abidjan", order: 1 },
      { section: "villes", label: "Bouaké", href: "/villes/bouake", order: 2 },
      { section: "villes", label: "Yamoussoukro", href: "/villes/yamoussoukro", order: 3 },
      { section: "villes", label: "Daloa", href: "/villes/daloa", order: 4 },
      { section: "villes", label: "Korhogo", href: "/villes/korhogo", order: 5 },
      { section: "information", label: "FAQ", href: "/faq", order: 1 },
      { section: "information", label: "Pages", href: "/pages", order: 2 },
    ]

    const existingLinks = await prisma.footerLink.count()
    if (existingLinks === 0) {
      await prisma.footerLink.createMany({ data: footerLinks })
    }

    const siteSettings = [
      { key: "site_name", value: "Parcelles" },
      { key: "site_description", value: "La plateforme de référence pour l'achat et la location de terrains et parcelles en Côte d'Ivoire." },
      { key: "contact_email", value: "contact@parcelles.ci" },
      { key: "contact_phone", value: "+225 27 20 00 00 00" },
    ]

    for (const setting of siteSettings) {
      await prisma.siteSetting.upsert({
        where: { key: setting.key },
        update: {},
        create: setting,
      })
    }

    return successResponse({
      message: "Base de données initialisée avec succès",
      admin: { email: "admin@parcelles.fr", password: "admin123" },
      listingsCreated: sampleListings.length,
    })
  } catch (error) {
    console.error("Seed error:", error)
    return errorResponse("Erreur lors de l'initialisation", 500)
  }
}
