import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { hash } from "bcryptjs"
import { UserRole, ListingStatus, LandType, ListingType } from "@prisma/client"

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

async function main() {
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

  console.log("Admin user created:", admin.email)

  const categories = [
    { name: "Terrain constructible", slug: "terrain-constructible", description: "Terrain sur lequel la construction est autorisée", order: 1 },
    { name: "Terrain viabilisé", slug: "terrain-viabilise", description: "Terrain raccordé aux réseaux (eau, électricité)", order: 2 },
    { name: "Terrain agricole", slug: "terrain-agricole", description: "Terrain destiné à l'exploitation agricole", order: 3 },
    { name: "Terrain forestier", slug: "terrain-forestier", description: "Terrain boisé et forestier", order: 4 },
    { name: "Lotissement", slug: "lotissement", description: "Terrain divisé en lots", order: 5 },
    { name: "Terrain non constructible", slug: "terrain-non-constructible", description: "Terrain où la construction est interdite", order: 6 },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log("Categories created:", categories.length)

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
      hasWaterAccess: true,
      hasRoadAccess: true,
      status: ListingStatus.PUBLISHED,
    },
    {
      title: "Lotissement de 6 lots constructibles",
      description: "Lotissement de 6 terrains constructibles viabilisés. Chaque lot fait entre 400 et 600 m². Tous les lots sont viabilisés (eau, électricité, assainissement). Accès goudronné.",
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
    },
    {
      title: "Terrain forestier de 5 hectares",
      description: "Magnifique parcelle forestière de 5 hectares. Bois mixte chênes et pins. Idéal pour activités sylvicoles ou projet de préservation. Accès par chemin carrossable.",
      price: 95000,
      surface: 50000,
      landType: LandType.FOREST,
      listingType: ListingType.SELL,
      city: "Limoges",
      department: "Haute-Vienne",
      departmentCode: "87",
      region: "Nouvelle-Aquitaine",
      postalCode: "87000",
      address: "Route de la Forêt",
      latitude: 45.8336,
      longitude: 1.2611,
      hasRoadAccess: true,
      status: ListingStatus.PUBLISHED,
    },
    {
      title: "Terrain viabilisé prêt à construire",
      description: "Terrain viabilisé de 600 m², tous réseaux en bordure. Idéal pour construction immédiate. Quartier résidentiel calme avec toutes les commodités à proximité.",
      price: 120000,
      surface: 600,
      landType: LandType.SERVICED,
      listingType: ListingType.SELL,
      city: "Nantes",
      department: "Loire-Atlantique",
      departmentCode: "44",
      region: "Pays de la Loire",
      postalCode: "44000",
      address: "Rue des Lilas",
      latitude: 47.2184,
      longitude: -1.5536,
      isServiced: true,
      isBuildable: true,
      hasElectricity: true,
      hasWaterAccess: true,
      hasRoadAccess: true,
      isFlat: true,
      isFeatured: true,
      isUrgent: true,
      status: ListingStatus.PUBLISHED,
    },
  ]

  for (const listing of sampleListings) {
    const slug = `${listing.city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")}-${listing.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").substring(0, 50)}-${Date.now()}`
    const pricePerSqm = Math.round(listing.price / listing.surface)
    const ref = `PAR-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    await prisma.listing.upsert({
      where: { slug },
      update: {},
      create: {
        ...listing,
        slug,
        pricePerSqm,
        reference: ref,
        authorId: admin.id,
        publishedAt: new Date(),
      },
    })
  }
  console.log("Sample listings created:", sampleListings.length)

  const faqEntries = [
    { question: "Comment acheter un terrain constructible ?", answer: "L'achat d'un terrain constructible nécessite de vérifier le PLU de la commune, de s'assurer que le terrain est raccordable aux réseaux et d'obtenir un certificat d'urbanisme opérationnel.", category: "Achat", order: 1 },
    { question: "Quelle est la différence entre un terrain viabilisé et non viabilisé ?", answer: "Un terrain viabilisé est raccordé aux réseaux publics (eau, électricité, gaz, assainissement). Un terrain non viabilisé nécessite des travaux de raccordement.", category: "Achat", order: 2 },
    { question: "Comment estimer le prix d'un terrain ?", answer: "Le prix dépend de la localisation, la surface, le classement PLU, la présence de réseaux, la topographie et les prix du marché local. Le prix au m² est un indicateur clé.", category: "Estimation", order: 3 },
    { question: "Quels sont les frais de notaire pour l'achat d'un terrain ?", answer: "Les frais de notaire pour l'achat d'un terrain nu représentent environ 7 à 8% du prix d'achat pour un terrain constructible et 5 à 6% pour un terrain agricole.", category: "Achat", order: 4 },
    { question: "Puis-je construire une maison sur un terrain agricole ?", answer: "La construction sur un terrain agricole est généralement interdite sauf pour des bâtiments liés à l'exploitation agricole.", category: "Réglementation", order: 5 },
  ]

  for (const faq of faqEntries) {
    await prisma.faqEntry.create({ data: faq })
  }
  console.log("FAQ entries created:", faqEntries.length)

  console.log("\n✅ Base de données initialisée !")
  console.log("   Admin: admin@parcelles.fr / admin123")
}

main()
  .catch((e) => {
    console.error("Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
