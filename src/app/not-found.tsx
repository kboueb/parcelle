import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl font-bold text-emerald-600 mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page non trouvée</h1>
      <p className="text-gray-500 mb-6">La page que vous recherchez n&apos;existe pas ou a été déplacée.</p>
      <Link href="/">
        <Button>Retour à l&apos;accueil</Button>
      </Link>
    </div>
  )
}
