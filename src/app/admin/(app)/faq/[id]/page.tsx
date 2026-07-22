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

export default function AdminFaqEditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const isNew = id === "nouveau"

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
    order: 0,
    isPublished: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/faq/${id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            const f = data.data
            setFormData({ question: f.question, answer: f.answer, category: f.category || "", order: f.order, isPublished: f.isPublished })
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
      const url = isNew ? "/api/faq" : `/api/faq/${id}`
      const method = isNew ? "POST" : "PUT"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur")
      toast.success(isNew ? "FAQ créée" : "FAQ mise à jour")
      router.replace("/admin/faq")
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
        <Link href="/admin/faq" className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{isNew ? "Nouvelle FAQ" : "Modifier la FAQ"}</h2>
          <p className="text-gray-500 mt-1">{isNew ? "Ajoutez une question fréquente" : "Modifiez la question et la réponse"}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Question / Réponse</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question *</Label>
              <Input id="question" value={formData.question} onChange={(e) => handleChange("question", e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Réponse *</Label>
              <Textarea id="answer" rows={5} value={formData.answer} onChange={(e) => handleChange("answer", e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Input id="category" value={formData.category} onChange={(e) => handleChange("category", e.target.value)} placeholder="Général, Technique..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Ordre</Label>
                <Input id="order" type="number" value={formData.order} onChange={(e) => handleChange("order", Number(e.target.value))} />
              </div>
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
              <Link href="/admin/faq">
                <Button type="button" variant="outline">Annuler</Button>
              </Link>
              {!isNew && (
                <Button
                  type="button"
                  variant="destructive"
                  className="ml-auto"
                  onClick={async () => {
                    if (!confirm("Supprimer cette FAQ ?")) return
                    try {
                      const res = await fetch(`/api/faq/${id}`, { method: "DELETE" })
                      if (res.ok) {
                        toast.success("FAQ supprimée")
                        router.replace("/admin/faq")
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
