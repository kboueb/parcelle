"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function AdminCategoryEditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const isNew = id === "nouveau"

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    color: "",
    isActive: true,
    order: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/categories/${id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            const c = data.data
            setFormData({ name: c.name, slug: c.slug, description: c.description || "", icon: c.icon || "", color: c.color || "", isActive: c.isActive, order: c.order })
          }
        })
        .catch(() => setError("Erreur lors du chargement"))
    }
  }, [id, isNew])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const url = isNew ? "/api/categories" : `/api/categories/${id}`
      const method = isNew ? "POST" : "PUT"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur")
      toast.success(isNew ? "Catégorie créée" : "Catégorie mise à jour")
      router.replace("/admin/categories")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/categories" className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{isNew ? "Nouvelle catégorie" : "Modifier la catégorie"}</h2>
          <p className="text-gray-500 mt-1">{isNew ? "Créez une nouvelle catégorie" : "Modifiez les informations de la catégorie"}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom *</Label>
                <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input id="slug" value={formData.slug} onChange={(e) => handleChange("slug", e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} value={formData.description} onChange={(e) => handleChange("description", e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icône</Label>
                <Input id="icon" value={formData.icon} onChange={(e) => handleChange("icon", e.target.value)} placeholder="home, map-pin..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Couleur</Label>
                <Input id="color" value={formData.color} onChange={(e) => handleChange("color", e.target.value)} placeholder="#10b981" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order">Ordre</Label>
                <Input id="order" type="number" value={formData.order} onChange={(e) => handleChange("order", Number(e.target.value))} />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={formData.isActive} onCheckedChange={(v) => handleChange("isActive", v)} />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                <Save className="h-4 w-4" />
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
              <Link href="/admin/categories">
                <Button type="button" variant="outline">Annuler</Button>
              </Link>
              {!isNew && (
                <Button
                  type="button"
                  variant="destructive"
                  className="ml-auto"
                  onClick={async () => {
                    if (!confirm("Supprimer cette catégorie ?")) return
                    try {
                      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" })
                      if (res.ok) {
                        toast.success("Catégorie supprimée")
                        router.replace("/admin/categories")
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
