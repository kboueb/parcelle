"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, FileText, Image, MessageSquare, Flag,
  BarChart3, Settings, Users, BookOpen, HelpCircle, Bell,
  Menu, X, MapPin, Layers, Map
} from "lucide-react"
import { useState, useEffect } from "react"

const navItems = [
  { label: "Tableau de bord", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Annonces", href: "/admin/annonces", icon: FileText },
  { label: "Catégories", href: "/admin/categories", icon: Layers },
  { label: "Régions", href: "/admin/regions", icon: Map },
  { label: "Médias", href: "/admin/medias", icon: Image },
  { label: "Leads", href: "/admin/leads", icon: MessageSquare },
  { label: "Signalements", href: "/admin/signalements", icon: Flag },
  { label: "Pages éditoriales", href: "/admin/pages", icon: BookOpen },
  { label: "FAQ", href: "/admin/faq", icon: HelpCircle },
  { label: "Bannières", href: "/admin/bannieres", icon: Bell },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
  { label: "Footer", href: "/admin/footer", icon: Layers },
  { label: "Utilisateurs", href: "/admin/utilisateurs", icon: Users },
  { label: "Statistiques", href: "/admin/statistiques", icon: BarChart3 },
  { label: "Paramètres", href: "/admin/parametres", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [siteName, setSiteName] = useState("Parcelles")

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => {
      if (d.success && d.data.site_name) setSiteName(d.data.site_name)
    }).catch(() => {})
  }, [])

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 lg:hidden flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center gap-2 px-6 border-b border-gray-200">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
            <span className="text-sm font-bold text-white">P</span>
          </div>
          <span className="text-lg font-bold text-gray-900">{siteName}</span>
          <span className="text-xs text-gray-400 ml-auto">Admin</span>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
