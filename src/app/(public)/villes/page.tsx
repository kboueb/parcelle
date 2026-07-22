import { prisma } from "@/lib/prisma"
import { ListingStatus } from "@prisma/client"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Terrains à vendre par ville",
  description: "Retrouvez tous nos terrains et parcelles à vendre dans les principales villes de France.",
}

export default async function CitiesPage() {
  const cities = await prisma.listing.groupBy({
    by: ["city", "department", "departmentCode"],
    where: { status: ListingStatus.PUBLISHED },
    _count: true,
    _min: { price: true },
    _max: { price: true },
    orderBy: { _count: { city: "desc" } },
    take: 100,
  })

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Terrains à vendre par ville</h1>
        <p className="text-gray-500 mt-2">Parcourez les annonces de terrains dans les principales villes de France</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cities.map((city) => (
          <Link key={city.city} href={`/villes/${city.city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}>
            <Card className="hover:border-emerald-200 hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{city.city}</h3>
                    <p className="text-sm text-gray-500">
                      {city.department} ({city.departmentCode})
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-600">{city._count}</div>
                    <div className="text-xs text-gray-400">annonces</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
