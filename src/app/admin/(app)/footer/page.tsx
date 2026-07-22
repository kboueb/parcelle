"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, GripVertical, Trash2, Save } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface FooterLink {
  id?: string
  section: string
  label: string
  href: string
  order: number
  isActive: boolean
}

const SECTIONS = [
  { key: "acheter", title: "Acheter", description: "Liens pour acheter un terrain" },
  { key: "villes", title: "Nos Villes", description: "Liens vers les pages villes" },
  { key: "information", title: "Information", description: "Liens utiles et contact" },
]

export default function FooterAdminPage() {
  const router = useRouter()
  const [links, setLinks] = useState<FooterLink[]>([])
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [linksRes, settingsRes] = await Promise.all([
        fetch("/api/footer"),
        fetch("/api/settings"),
      ])
      const linksData = await linksRes.json()
      const settingsData = await settingsRes.json()
      if (linksData.success) setLinks(linksData.data)
      if (settingsData.success) {
        const descSetting = settingsData.data.site_description
        if (descSetting) setDescription(descSetting)
      }
    } catch {
      toast.error("Erreur lors du chargement")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const addLink = (section: string) => {
    setLinks([...links, { section, label: "", href: "", order: links.filter(l => l.section === section).length, isActive: true }])
  }

  const updateLink = (index: number, field: keyof FooterLink, value: string | number | boolean) => {
    const updated = [...links]
    updated[index] = { ...updated[index], [field]: value }
    setLinks(updated)
  }

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Save description
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site_description: description }),
      })

      // Delete removed links
      const existingIds = links.filter(l => l.id).map(l => l.id)
      for (const link of links) {
        if (link.id && !existingIds?.includes(link.id)) {
          await fetch(`/api/footer/${link.id}`, { method: "DELETE" })
        }
      }

      // Create/update links
      for (let i = 0; i < links.length; i++) {
        const link = { ...links[i], order: i }
        if (link.id) {
          await fetch(`/api/footer/${link.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(link),
          })
        } else {
          await fetch("/api/footer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(link),
          })
        }
      }

      toast.success("Footer sauvegardé !")
      fetchData()
    } catch {
      toast.error("Erreur lors de la sauvegarde")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-gray-100 animate-pulse" />
          <div className="h-8 w-48 rounded bg-gray-100 animate-pulse" />
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard" className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Footer du site</h1>
          <p className="text-sm text-gray-500">Gérez les liens et le texte affichés dans le pied de page</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description du site affichée dans le footer..."
          />
        </CardContent>
      </Card>

      {SECTIONS.map(section => {
        const sectionLinks = links
          .map((l, i) => ({ ...l, _index: i }))
          .filter(l => l.section === section.key)

        return (
          <Card key={section.key}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{section.title}</CardTitle>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => addLink(section.key)}>
                <Plus className="h-4 w-4 mr-1" /> Ajouter
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {sectionLinks.length === 0 && (
                <p className="text-sm text-gray-400 italic">Aucun lien</p>
              )}
              {sectionLinks.map(link => (
                <div key={link.id || link._index} className="flex items-center gap-2 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                  <GripVertical className="h-4 w-4 text-gray-300 shrink-0" />
                  <Input
                    value={link.label}
                    onChange={e => updateLink(link._index, "label", e.target.value)}
                    placeholder="Libellé"
                    className="flex-1"
                  />
                  <Input
                    value={link.href}
                    onChange={e => updateLink(link._index, "href", e.target.value)}
                    placeholder="/terrain/abidjan"
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeLink(link._index)}
                    className="text-red-500 hover:text-red-600 shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </div>
    </div>
  )
}
