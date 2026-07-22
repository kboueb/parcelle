import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString("fr-FR")} FCFA`
}

export function formatSurface(surface: number): string {
  return `${surface.toLocaleString("fr-FR")} m²`
}

export function formatPricePerSqm(price: number, surface: number): number {
  if (surface === 0) return 0
  return Math.round(price / surface)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length).trim() + "..."
}

export function generateReference(): string {
  const year = new Date().getFullYear()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `PAR-${year}-${random}`
}

export function parsePageParam(param: string | string[] | undefined): number {
  const page = Number(param)
  return Number.isNaN(page) || page < 1 ? 1 : page
}
