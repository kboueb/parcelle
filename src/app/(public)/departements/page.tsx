import { prisma } from "@/lib/prisma"
import { ListingStatus } from "@prisma/client"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Terrains à vendre par département",
  description: "Retrouvez tous nos terrains et parcelles à vendre par département.",
}

export default async function DepartmentsPage() {
  const departments = await prisma.listing.groupBy({
    by: ["department", "departmentCode"],
    where: { status: ListingStatus.PUBLISHED },
    _count: true,
    _min: { price: true },
    orderBy: { department: "asc" },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Terrains à vendre par département</h1>
        <p className="text-gray-500 mt-2">Parcourez les annonces par département</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {departments.map((dept) => (
          <Link
            key={dept.departmentCode}
            href={`/departements/${dept.departmentCode}`}
            className="block"
          >
            <Card className="hover:border-emerald-200 hover:shadow-md transition-all text-center">
              <CardContent className="p-4">
                <div className="text-lg font-bold text-emerald-600">{dept.departmentCode}</div>
                <div className="text-sm text-gray-600 truncate">{dept.department}</div>
                <div className="text-xs text-gray-400 mt-1">{dept._count} annonces</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
