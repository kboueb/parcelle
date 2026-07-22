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

export default function AdminPageEditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const isNew = id === "nouveau"

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    imageUrl: "",
    isPublished: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/editorial/${id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            const p = data.data
            setFormData({ title: p.title, content: p.content, excerpt: p.excerpt || "", imageUrl: p.imageUrl || "", isPublished: p.isPublished })
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
      const url = isNew ? "/api/editorial" : `/api/editorial/${id}`
      const method = isNew ? "POST" : "PUT"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur")
      toast.success(isNew ? "Page créée" : "Page mise à jour")
      router.replace("/admin/pages")
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
        <Link href="/admin/pages" className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{isNew ? "Nouvelle page" : "Modifier la page"}</h2>
          <p className="text-gray-500 mt-1">{isNew ? "Créez une nouvelle page éditoriale" : "Modifiez le contenu de la page"}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contenu</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input id="title" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Extrait / Description</Label>
              <Input id="excerpt" value={formData.excerpt} onChange={(e) => handleChange("excerpt", e.target.value)} placeholder="Court résumé pour le référencement" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL de l&apos;image de bannière</Label>
              <Input id="imageUrl" value={formData.imageUrl} onChange={(e) => handleChange("imageUrl", e.target.value)} placeholder="/uploads/pages/hero.jpg" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenu *</Label>
              <Textarea id="content" rows={15} value={formData.content} onChange={(e) => handleChange("content", e.target.value)} required />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={formData.isPublished} onCheckedChange={(v) => handleChange("isPublished", v)} />
              <span className="text-sm text-gray-700">Publiée</span>
            </label>

            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                <Save className="h-4 w-4" />
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
              <Link href="/admin/pages">
                <Button type="button" variant="outline">Annuler</Button>
              </Link>
              {!isNew && (
                <Button
                  type="button"
                  variant="destructive"
                  className="ml-auto"
                  onClick={async () => {
                    if (!confirm("Supprimer cette page ?")) return
                    try {
                      const res = await fetch(`/api/editorial/${id}`, { method: "DELETE" })
                      if (res.ok) {
                        toast.success("Page supprimée")
                        router.replace("/admin/pages")
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
