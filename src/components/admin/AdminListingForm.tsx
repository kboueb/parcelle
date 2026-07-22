"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { LAND_TYPE_OPTIONS, LISTING_STATUS_LABELS } from "@/lib/constants"
import { ImageUpload, type ImageData } from "@/components/admin/ImageUpload"
import { Save, Send } from "lucide-react"
import { toast } from "sonner"
import { useEffect, useState as useStateReact } from "react"

type Props = {
  listing?: {
    id: string
    title: string
    description: string
    shortDescription: string | null
    price: number
    rentalPrice: number | null
    surface: number
    landType: string
    listingType: string
    address: string
    city: string
    postalCode: string
    department: string
    departmentCode: string
    region: string
    latitude: number | null
    longitude: number | null
    isServiced: boolean
    isBuildable: boolean
    isFenced: boolean
    hasWaterAccess: boolean
    hasElectricity: boolean
    hasRoadAccess: boolean
    isFlat: boolean
    reference: string | null
    cadastralRef: string | null
    lotNumber: string | null
    isFeatured: boolean
    isUrgent: boolean
    isExclusive: boolean
    status: string
    categoryId: string | null
  }
}

export function AdminListingForm({ listing }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [regions, setRegions] = useStateReact<string[]>([])

  useEffect(() => {
    fetch("/api/regions")
      .then(r => r.json())
      .then(d => {
        if (d.success) setRegions(d.data.filter((r: any) => r.isActive).map((r: any) => r.name))
      })
      .catch(() => {})
  }, [])
  const [images, setImages] = useState<ImageData[]>(
    () => (listing as any)?.images?.map((img: any, i: number) => ({
      id: img.id,
      url: img.url,
      thumbnailUrl: img.thumbnailUrl,
      isPrimary: img.isPrimary,
      order: img.order ?? i,
    })) || []
  )
  const [formData, setFormData] = useState({
    title: listing?.title || "",
    description: listing?.description || "",
    shortDescription: listing?.shortDescription || "",
    price: listing?.price?.toString() || "",
    rentalPrice: listing?.rentalPrice?.toString() || "",
    surface: listing?.surface?.toString() || "",
    landType: listing?.landType || "BUILDABLE",
    listingType: listing?.listingType || "SELL",
    address: listing?.address || "",
    city: listing?.city || "",
    postalCode: listing?.postalCode || "",
    department: listing?.department || "",
    departmentCode: listing?.departmentCode || "",
    region: listing?.region || "",
    latitude: listing?.latitude?.toString() || "",
    longitude: listing?.longitude?.toString() || "",
    isServiced: listing?.isServiced || false,
    isBuildable: listing?.isBuildable || false,
    isFenced: listing?.isFenced || false,
    hasWaterAccess: listing?.hasWaterAccess || false,
    hasElectricity: listing?.hasElectricity || false,
    hasRoadAccess: listing?.hasRoadAccess || false,
    isFlat: listing?.isFlat || false,
    reference: listing?.reference || "",
    cadastralRef: listing?.cadastralRef || "",
    lotNumber: listing?.lotNumber || "",
    isFeatured: listing?.isFeatured || false,
    isUrgent: listing?.isUrgent || false,
    isExclusive: listing?.isExclusive || false,
    status: listing?.status || "DRAFT",
    categoryId: listing?.categoryId || "",
  })

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (status: string) => {
    setIsSubmitting(true)
    setError("")

    const payload = {
      ...formData,
      price: formData.price ? Number(formData.price) : undefined,
      rentalPrice: formData.rentalPrice ? Number(formData.rentalPrice) : undefined,
      surface: formData.surface ? Number(formData.surface) : undefined,
      latitude: formData.latitude ? Number(formData.latitude) : undefined,
      longitude: formData.longitude ? Number(formData.longitude) : undefined,
      status,
      images: images.map(({ id, url, isPrimary, order }) => ({ id, url, isPrimary, order })),
    }

    try {
      const url = listing ? `/api/listings/${listing.id}` : "/api/listings"
      const method = listing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur lors de la sauvegarde")

      toast.success(listing ? "Annonce mise à jour" : "Annonce créée")
      router.replace("/admin/annonces")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations principales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Titre de l&apos;annonce *</Label>
              <Input id="title" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} placeholder="Ex: Beau terrain constructible avec vue" />
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" rows={6} value={formData.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Description détaillée du terrain..." />
            </div>
            <div>
              <Label htmlFor="shortDescription">Description courte</Label>
              <Textarea id="shortDescription" rows={2} value={formData.shortDescription} onChange={(e) => handleChange("shortDescription", e.target.value)} placeholder="Résumé accrocheur (optionnel)" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prix et surface</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Prix de vente (FCFA) *</Label>
              <Input id="price" type="number" value={formData.price} onChange={(e) => handleChange("price", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="rentalPrice">Prix de location (FCFA/mois)</Label>
              <Input id="rentalPrice" type="number" value={formData.rentalPrice} onChange={(e) => handleChange("rentalPrice", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="surface">Surface (m²) *</Label>
              <Input id="surface" type="number" value={formData.surface} onChange={(e) => handleChange("surface", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="landType">Type de terrain *</Label>
              <Select value={formData.landType} onValueChange={(v) => handleChange("landType", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LAND_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Localisation</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="address">Adresse *</Label>
              <Input id="address" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="city">Ville *</Label>
              <Input id="city" value={formData.city} onChange={(e) => handleChange("city", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="postalCode">Code postal *</Label>
              <Input id="postalCode" value={formData.postalCode} onChange={(e) => handleChange("postalCode", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="department">Département *</Label>
              <Input id="department" value={formData.department} onChange={(e) => handleChange("department", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="departmentCode">Code département *</Label>
              <Input id="departmentCode" value={formData.departmentCode} onChange={(e) => handleChange("departmentCode", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="region">Région *</Label>
              <Select value={formData.region} onValueChange={(v) => handleChange("region", v)}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {regions.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input id="latitude" type="number" step="any" value={formData.latitude} onChange={(e) => handleChange("latitude", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input id="longitude" type="number" step="any" value={formData.longitude} onChange={(e) => handleChange("longitude", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Caractéristiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { field: "isServiced", label: "Viabilisé" },
                { field: "isBuildable", label: "Constructible" },
                { field: "isFenced", label: "Clôturé" },
                { field: "hasWaterAccess", label: "Accès à l'eau" },
                { field: "hasElectricity", label: "Électricité" },
                { field: "hasRoadAccess", label: "Accès routier" },
                { field: "isFlat", label: "Terrain plat" },
              ].map(({ field, label }) => (
                <label key={field} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={(formData as any)[field]} onCheckedChange={(v) => handleChange(field, v)} />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload images={images} onChange={setImages} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations complémentaires</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reference">Référence interne</Label>
              <Input id="reference" value={formData.reference} onChange={(e) => handleChange("reference", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="cadastralRef">Référence cadastrale</Label>
              <Input id="cadastralRef" value={formData.cadastralRef} onChange={(e) => handleChange("cadastralRef", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="lotNumber">Numéro de lot</Label>
              <Input id="lotNumber" value={formData.lotNumber} onChange={(e) => handleChange("lotNumber", e.target.value)} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Publication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Statut</Label>
              <Select value={formData.status} onValueChange={(v) => handleChange("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(LISTING_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="space-y-2">
              {[
                { field: "isFeatured", label: "Mise en avant" },
                { field: "isUrgent", label: "Urgent" },
                { field: "isExclusive", label: "Exclusif" },
              ].map(({ field, label }) => (
                <label key={field} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={(formData as any)[field]} onCheckedChange={(v) => handleChange(field, v)} />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
            <Separator />
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>}
            <div className="space-y-2">
              <Button
                onClick={() => handleSubmit("PUBLISHED")}
                disabled={isSubmitting}
                className="w-full gap-2"
              >
                <Send className="h-4 w-4" />
                Publier
              </Button>
              <Button
                onClick={() => handleSubmit(formData.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT")}
                disabled={isSubmitting}
                variant="outline"
                className="w-full gap-2"
              >
                <Save className="h-4 w-4" />
                Enregistrer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
