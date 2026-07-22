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

export default function AdminBannerEditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const isNew = id === "nouveau"

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    linkUrl: "",
    isActive: true,
    order: 0,
    startAt: "",
    endAt: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/banners/${id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            const b = data.data
            setFormData({
              title: b.title,
              subtitle: b.subtitle || "",
              imageUrl: b.imageUrl || "",
              linkUrl: b.linkUrl || "",
              isActive: b.isActive,
              order: b.order,
              startAt: b.startAt ? new Date(b.startAt).toISOString().slice(0, 16) : "",
              endAt: b.endAt ? new Date(b.endAt).toISOString().slice(0, 16) : "",
            })
          }
        })
        .catch(() => setError("Erreur lors du chargement"))
    }
  }, [id, isNew])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const payload = {
      ...formData,
      startAt: formData.startAt ? new Date(formData.startAt).toISOString() : null,
      endAt: formData.endAt ? new Date(formData.endAt).toISOString() : null,
    }

    try {
      const url = isNew ? "/api/banners" : `/api/banners/${id}`
      const method = isNew ? "POST" : "PUT"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur")
      toast.success(isNew ? "Bannière créée" : "Bannière mise à jour")
      router.replace("/admin/bannieres")
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
        <Link href="/admin/bannieres" className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{isNew ? "Nouvelle bannière" : "Modifier la bannière"}</h2>
          <p className="text-gray-500 mt-1">{isNew ? "Créez une nouvelle bannière" : "Modifiez les informations de la bannière"}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input id="title" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Sous-titre</Label>
              <Input id="subtitle" value={formData.subtitle} onChange={(e) => handleChange("subtitle", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL de l&apos;image</Label>
              <Input id="imageUrl" value={formData.imageUrl} onChange={(e) => handleChange("imageUrl", e.target.value)} placeholder="/uploads/banners/hero.jpg" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkUrl">Lien de redirection</Label>
              <Input id="linkUrl" value={formData.linkUrl} onChange={(e) => handleChange("linkUrl", e.target.value)} placeholder="https://..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order">Ordre d&apos;affichage</Label>
                <Input id="order" type="number" value={formData.order} onChange={(e) => handleChange("order", Number(e.target.value))} />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={formData.isActive} onCheckedChange={(v) => handleChange("isActive", v)} />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startAt">Début de publication</Label>
                <Input id="startAt" type="datetime-local" value={formData.startAt} onChange={(e) => handleChange("startAt", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endAt">Fin de publication</Label>
                <Input id="endAt" type="datetime-local" value={formData.endAt} onChange={(e) => handleChange("endAt", e.target.value)} />
              </div>
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                <Save className="h-4 w-4" />
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
              <Link href="/admin/bannieres">
                <Button type="button" variant="outline">Annuler</Button>
              </Link>
              {!isNew && (
                <Button
                  type="button"
                  variant="destructive"
                  className="ml-auto"
                  onClick={async () => {
                    if (!confirm("Supprimer cette bannière ?")) return
                    try {
                      const res = await fetch(`/api/banners/${id}`, { method: "DELETE" })
                      if (res.ok) {
                        toast.success("Bannière supprimée")
                        router.replace("/admin/bannieres")
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
