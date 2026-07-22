"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Save, Globe, Phone, Share2, Search } from "lucide-react"
import { toast } from "sonner"

const SECTIONS = [
  {
    id: "general",
    title: "Général",
    description: "Informations principales du site",
    icon: Globe,
    fields: [
      { key: "site_name", label: "Nom du site", placeholder: "Parcelles", type: "input" },
      { key: "site_description", label: "Description du site", placeholder: "La plateforme de référence...", type: "textarea" },
      { key: "site_url", label: "URL du site", placeholder: "https://parcelles.ci", type: "input" },
      { key: "currency", label: "Devise", placeholder: "FCFA", type: "input" },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    description: "Coordonnées de contact",
    icon: Phone,
    fields: [
      { key: "contact_email", label: "Email de contact", placeholder: "contact@parcelles.ci", type: "input" },
      { key: "contact_phone", label: "Téléphone", placeholder: "+225 07 00 00 00", type: "input" },
      { key: "contact_whatsapp", label: "WhatsApp", placeholder: "+225 07 00 00 00", type: "input" },
      { key: "contact_address", label: "Adresse", placeholder: "Abidjan, Côte d'Ivoire", type: "input" },
    ],
  },
  {
    id: "social",
    title: "Réseaux sociaux",
    description: "Liens vers vos réseaux",
    icon: Share2,
    fields: [
      { key: "social_facebook", label: "Facebook", placeholder: "https://facebook.com/parcelles", type: "input" },
      { key: "social_instagram", label: "Instagram", placeholder: "https://instagram.com/parcelles", type: "input" },
      { key: "social_twitter", label: "Twitter / X", placeholder: "https://x.com/parcelles", type: "input" },
      { key: "social_linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/parcelles", type: "input" },
      { key: "social_youtube", label: "YouTube", placeholder: "https://youtube.com/@parcelles", type: "input" },
      { key: "social_tiktok", label: "TikTok", placeholder: "https://tiktok.com/@parcelles", type: "input" },
    ],
  },
  {
    id: "seo",
    title: "SEO",
    description: "Optimisation pour les moteurs de recherche",
    icon: Search,
    fields: [
      { key: "seo_title", label: "Title par défaut", placeholder: "Parcelles - Terrains et parcelles en Côte d'Ivoire", type: "input" },
      { key: "seo_description", label: "Meta description par défaut", placeholder: "Trouvez votre terrain...", type: "textarea" },
      { key: "seo_keywords", label: "Mots-clés par défaut", placeholder: "terrain, parcelle, abidjan, immobilier", type: "textarea" },
    ],
  },
]

export default function AdminParametresPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings")
      const data = await res.json()
      if (data.success) setValues(data.data)
    } catch {
      toast.error("Erreur lors du chargement")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSettings() }, [fetchSettings])

  const update = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Paramètres sauvegardés !")
      } else {
        toast.error(data.error || "Erreur")
      }
    } catch {
      toast.error("Erreur lors de la sauvegarde")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 rounded bg-gray-100 animate-pulse" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Paramètres</h1>
          <p className="text-sm text-gray-500">Configuration générale de la plateforme</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </div>

      {SECTIONS.map(section => (
        <Card key={section.id}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                <section.icon className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {section.fields.map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                {field.type === "textarea" ? (
                  <Textarea
                    value={values[field.key] || ""}
                    onChange={e => update(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                  />
                ) : (
                  <Input
                    value={values[field.key] || ""}
                    onChange={e => update(field.key, e.target.value)}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
