"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

type Props = {
  listingId: string
  listingTitle: string
}

export function DeleteListingButton({ listingId, listingTitle }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Supprimer l'annonce « ${listingTitle} » ? Cette action est irréversible.`)) return

    setLoading(true)
    try {
      const res = await fetch(`/api/listings/${listingId}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        toast.success("Annonce supprimée")
        router.refresh()
      } else {
        toast.error(data.error || "Erreur lors de la suppression")
      }
    } catch {
      toast.error("Erreur lors de la suppression")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
      title="Supprimer"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}
