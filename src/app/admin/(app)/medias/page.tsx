import { Image } from "lucide-react"
import Link from "next/link"

export default function AdminMediasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Médias</h2>
        <p className="text-gray-500 mt-1">Gestion des fichiers et images</p>
      </div>

      <div className="text-center py-16">
        <Image className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">En construction</h3>
        <p className="text-gray-500 mb-4">La médiathèque sera bientôt disponible</p>
        <Link href="/admin/dashboard" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  )
}
