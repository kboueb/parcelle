"use client"

import { useState } from "react"
import { Bell, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AlertsPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, filters: {}, frequency: "daily" }),
      })
      if (res.ok) setIsSuccess(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-900">Alertes</h1>
        </div>
        <p className="text-gray-500 mt-2">Soyez notifié des nouvelles annonces correspondant à vos critères</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Créer une alerte</CardTitle>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="text-center py-6">
              <Mail className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Alerte créée !</h3>
              <p className="text-gray-500">Vous recevrez un email lors de la publication de nouvelles annonces.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Votre email *</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.fr" />
              </div>
              <p className="text-sm text-gray-500">Vous pourrez définir des filtres plus précis après la création.</p>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Création..." : "Créer l'alerte"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
