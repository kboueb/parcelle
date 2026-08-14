"use client"

import { useState } from "react"
import { Upload, X } from "lucide-react"
import { toast } from "sonner"

type Props = {
  value: string
  onChange: (value: string) => void
  folder?: string
  label?: string
  className?: string
}

export function ImageField({ value, onChange, folder = "pages", label = "Téléverser une image", className }: Props) {
  const [uploading, setUploading] = useState(false)

  const handleFile = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("folder", folder)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (data.success) onChange(data.data.url)
      else toast.error(data.error || "Erreur d'upload")
    } catch {
      toast.error("Erreur d'upload")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      {value && (
        <div className={`relative inline-block ${className || ""}`}>
          <img
            src={value}
            alt=""
            className="h-24 w-auto max-w-xs rounded-lg border border-gray-200 bg-gray-50 object-contain"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white p-1 hover:bg-red-600"
            title="Supprimer l'image"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-emerald-600 hover:text-emerald-700 font-medium">
        <Upload className="h-4 w-4" />
        {uploading ? "Upload..." : value ? "Remplacer" : label}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
            e.target.value = ""
          }}
        />
      </label>
    </div>
  )
}
