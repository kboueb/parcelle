"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function AdminRegionEditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const isNew = id === "nouveau"

  const [formData, setFormData] = useState({
    name: "",
    isActive: true,
    order: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/regions/${id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            const r = data.data
            setFormData({ name: r.name, isActive: r.isActive, order: r.order })
          }
        })
        .catch(() => toast.error("Erreur lors du chargement"))
    }
  }, [id, isNew])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = isNew ? "/api/regions" : `/api/regions/${id}`
      const method = isNew ? "POST" : "PUT"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur")
      toast.success(isNew ? "Région créée" : "Région mise à jour")
      router.replace("/admin/regions")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/regions" className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{isNew ? "Nouvelle région" : "Modifier la région"}</h2>
          <p className="text-gray-500 mt-1">{isNew ? "Ajoutez une nouvelle région" : "Modifiez les informations de la région"}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom *</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} required placeholder="Ex: Lagunes" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order">Ordre</Label>
                <Input id="order" type="number" value={formData.order} onChange={(e) => setFormData(prev => ({ ...prev, order: Number(e.target.value) }))} />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={formData.isActive} onCheckedChange={(v) => setFormData(prev => ({ ...prev, isActive: v as boolean }))} />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                <Save className="h-4 w-4" />
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
              <Link href="/admin/regions">
                <Button type="button" variant="outline">Annuler</Button>
              </Link>
              {!isNew && (
                <Button
                  type="button"
                  variant="destructive"
                  className="ml-auto"
                  onClick={async () => {
                    if (!confirm("Supprimer cette région ?")) return
                    try {
                      const res = await fetch(`/api/regions/${id}`, { method: "DELETE" })
                      if (res.ok) {
                        toast.success("Région supprimée")
                        router.replace("/admin/regions")
                      }
                    } catch {}
                  }}
                >
                  Supprimer
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
