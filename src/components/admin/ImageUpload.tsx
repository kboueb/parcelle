"use client"

import { useState, useCallback } from "react"
import { Upload, X, Star, StarOff, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export type ImageData = {
  id?: string
  url: string
  thumbnailUrl?: string | null
  isPrimary: boolean
  order: number
  file?: File
}

type Props = {
  images: ImageData[]
  onChange: (images: ImageData[]) => void
}

export function ImageUpload({ images, onChange }: Props) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files?.length) return
    setIsUploading(true)

    const uploaded: ImageData[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file.type.startsWith("image/")) continue

      const formData = new FormData()
      formData.append("file", file)

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData })
        const data = await res.json()
        if (data.success) {
          uploaded.push({
            url: data.data.url,
            isPrimary: images.length + uploaded.length === 0,
            order: images.length + uploaded.length,
            file,
          })
        }
      } catch (err) {
        toast.error("Échec de l'upload")
      }
    }

    setIsUploading(false)
    onChange([...images, ...uploaded])
  }, [images, onChange])

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    if (updated.length > 0 && !updated.some(i => i.isPrimary)) {
      updated[0].isPrimary = true
    }
    onChange(updated)
  }

  const setPrimary = (index: number) => {
    onChange(images.map((img, i) => ({ ...img, isPrimary: i === index })))
  }

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return
    const updated = [...images]
    const [moved] = updated.splice(from, 1)
    updated.splice(to, 0, moved)
    onChange(updated.map((img, i) => ({ ...img, order: i })))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((img, index) => (
          <div key={index} className="relative group aspect-[4/3] rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
            <img
              src={img.url}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
              <button
                onClick={() => setPrimary(index)}
                className="p-1.5 rounded-md bg-white/90 hover:bg-white text-gray-700"
                title={img.isPrimary ? "Image principale" : "Définir comme principale"}
              >
                {img.isPrimary ? <Star className="h-4 w-4 text-amber-500" /> : <StarOff className="h-4 w-4" />}
              </button>
              {index > 0 && (
                <button onClick={() => moveImage(index, index - 1)} className="p-1.5 rounded-md bg-white/90 hover:bg-white text-gray-700">
                  <GripVertical className="h-4 w-4 rotate-90" />
                </button>
              )}
              <button
                onClick={() => removeImage(index)}
                className="p-1.5 rounded-md bg-red-500/90 hover:bg-red-500 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {img.isPrimary && (
              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-amber-500 text-white text-[10px] font-medium">
                Principale
              </div>
            )}
          </div>
        ))}

        <label className={cn(
          "flex flex-col items-center justify-center aspect-[4/3] rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors",
          isUploading && "opacity-50 pointer-events-none"
        )}>
          <Upload className="h-6 w-6 text-gray-400 mb-1" />
          <span className="text-xs text-gray-500">
            {isUploading ? "Upload..." : "Ajouter"}
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            disabled={isUploading}
          />
        </label>
      </div>
    </div>
  )
}
