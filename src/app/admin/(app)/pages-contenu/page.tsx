"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Plus, Trash2, ChevronUp, ChevronDown, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageField } from "@/components/admin/ImageField"
import { PAGE_DEFAULTS, PAGE_KEYS, type PageKey } from "@/lib/page-content-defaults"
import { PAGE_FIELDS, type PageField } from "@/lib/page-content-fields"

type PageForm = {
  page: PageKey
  title: string
  subtitle: string
  seoTitle: string
  seoDescription: string
  content: Record<string, any>
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

function buildForm(page: PageKey, db?: any): PageForm {
  const def = PAGE_DEFAULTS[page]
  const content: Record<string, any> = {}
  for (const [key, value] of Object.entries(def.sections)) content[key] = deepClone(value)
  if (db?.content) {
    for (const [key, value] of Object.entries(db.content)) content[key] = deepClone(value)
  }
  return {
    page,
    title: db?.title ?? def.title ?? "",
    subtitle: db?.subtitle ?? def.subtitle ?? "",
    seoTitle: db?.seoTitle ?? def.seoTitle ?? "",
    seoDescription: db?.seoDescription ?? def.seoDescription ?? "",
    content,
  }
}

function ListEditor({ field, value, onChange }: { field: PageField; value: any[]; onChange: (v: any[]) => void }) {
  const items = Array.isArray(value) ? value : []

  const addItem = () => {
    const item: Record<string, any> = {}
    for (const f of field.itemFields || []) item[f.key] = f.type === "list" ? [] : ""
    onChange([...items, item])
  }

  const updateItem = (index: number, key: string, v: any) => {
    onChange(items.map((it, i) => (i === index ? { ...it, [key]: v } : it)))
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const moveItem = (index: number, dir: number) => {
    const target = index + dir
    if (target < 0 || target >= items.length) return
    const next = [...items]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved)
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="rounded-lg border border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {field.itemLabel || "Élément"} {index + 1}
            </span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => moveItem(index, -1)} disabled={index === 0} className="p-1 rounded hover:bg-gray-100 text-gray-500 disabled:opacity-30">
                <ChevronUp className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => moveItem(index, 1)} disabled={index === items.length - 1} className="p-1 rounded hover:bg-gray-100 text-gray-500 disabled:opacity-30">
                <ChevronDown className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => removeItem(index)} className="p-1 rounded hover:bg-red-50 text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          {field.itemFields?.map((subField) => (
            <div key={subField.key}>
              <label className="block text-xs font-medium text-gray-500 mb-1">{subField.label}</label>
              <FieldEditor field={subField} value={item[subField.key]} onChange={(v) => updateItem(index, subField.key, v)} />
            </div>
          ))}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-1">
        <Plus className="h-3.5 w-3.5" />
        Ajouter
      </Button>
    </div>
  )
}

function FieldEditor({ field, value, onChange }: { field: PageField; value: any; onChange: (v: any) => void }) {
  switch (field.type) {
    case "input":
      return <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} />
    case "textarea":
      return <Textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} rows={3} />
    case "select":
      return (
        <Select value={value || undefined} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder || "Choisir..."} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    case "list":
      return <ListEditor field={field} value={value} onChange={onChange} />
    case "image":
      return <ImageField value={value || ""} onChange={onChange} />
    case "checkbox":
      return (
        <Checkbox checked={Boolean(value)} onCheckedChange={(v) => onChange(Boolean(v))} />
      )
    default:
      return <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} />
  }
}

export default function AdminPagesContenuPage() {
  const [forms, setForms] = useState<Record<PageKey, PageForm>>({} as Record<PageKey, PageForm>)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<PageKey | null>(null)

  useEffect(() => {
    fetch("/api/page-content")
      .then((r) => r.json())
      .then((data) => {
        const records = (data.data || []) as any[]
        const next = {} as Record<PageKey, PageForm>
        for (const key of PAGE_KEYS) {
          next[key] = buildForm(key, records.find((r) => r.page === key))
        }
        setForms(next)
      })
      .catch(() => toast.error("Erreur lors du chargement"))
      .finally(() => setLoading(false))
  }, [])

  const updateField = useCallback((page: PageKey, path: string[], value: any) => {
    setForms((prev) => {
      const form = deepClone(prev[page])
      let cursor: any = form
      for (let i = 0; i < path.length - 1; i++) cursor = cursor[path[i]]
      cursor[path[path.length - 1]] = value
      return { ...prev, [page]: form }
    })
  }, [])

  const resetPage = (page: PageKey) => {
    setForms((prev) => ({ ...prev, [page]: buildForm(page) }))
    toast.success("Valeurs par défaut restaurées")
  }

  const handleSave = async (page: PageKey) => {
    const form = forms[page]
    setSaving(page)
    try {
      const res = await fetch("/api/page-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || "Erreur")
      toast.success("Page sauvegardée")
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la sauvegarde")
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 rounded bg-gray-100 animate-pulse" />
        <div className="h-64 rounded-lg bg-gray-100 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contenu des pages</h1>
        <p className="text-sm text-gray-500 mt-1">Personnalisez le contenu de chaque page du site</p>
      </div>

      <Tabs defaultValue="home">
        <TabsList className="flex-wrap h-auto gap-1 p-1">
          {PAGE_FIELDS.map((schema) => (
            <TabsTrigger key={schema.key} value={schema.key}>
              {schema.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {PAGE_FIELDS.map((schema) => {
          const page = schema.key
          const form = forms[page]
          return (
            <TabsContent key={page} value={page}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">{schema.description}</p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => resetPage(page)} className="gap-1">
                    <RotateCcw className="h-4 w-4" />
                    Défauts
                  </Button>
                  <Button onClick={() => handleSave(page)} disabled={saving === page} className="bg-emerald-600 hover:bg-emerald-700 gap-1">
                    <Save className="h-4 w-4" />
                    {saving === page ? "Sauvegarde..." : "Sauvegarder"}
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>En-tête</CardTitle>
                    <CardDescription>Titre, sous-titre et référencement de la page</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                        <Input value={form?.title || ""} onChange={(e) => updateField(page, ["title"], e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sous-titre</label>
                        <Input value={form?.subtitle || ""} onChange={(e) => updateField(page, ["subtitle"], e.target.value)} />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre SEO</label>
                        <Input value={form?.seoTitle || ""} onChange={(e) => updateField(page, ["seoTitle"], e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description SEO</label>
                        <Input value={form?.seoDescription || ""} onChange={(e) => updateField(page, ["seoDescription"], e.target.value)} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {schema.sections.map((section) => (
                  <Card key={section.key}>
                    <CardHeader>
                      <CardTitle>{section.title}</CardTitle>
                      {section.description && <CardDescription>{section.description}</CardDescription>}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {section.fields.map((field) =>
                        field.type === "checkbox" ? (
                          <label key={field.key} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={Boolean(form?.content?.[section.key]?.[field.key])}
                              onCheckedChange={(v) => updateField(page, ["content", section.key, field.key], Boolean(v))}
                            />
                            <span className="text-sm font-medium text-gray-700">{field.label}</span>
                          </label>
                        ) : (
                          <div key={field.key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                            <FieldEditor
                              field={field}
                              value={form?.content?.[section.key]?.[field.key]}
                              onChange={(v) => updateField(page, ["content", section.key, field.key], v)}
                            />
                          </div>
                        )
                      )}
                    </CardContent>
                  </Card>
                ))}

                {schema.sections.length === 0 && (
                  <Card>
                    <CardContent className="py-8 text-center text-sm text-gray-500">
                      Aucune section supplémentaire pour cette page. L&apos;en-tête ci-dessus est entièrement personnalisable.
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
