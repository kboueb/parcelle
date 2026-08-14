import type { PageKey } from "./page-content-defaults"

export type PageFieldType = "input" | "textarea" | "select" | "list" | "image" | "checkbox"

export type PageField = {
  key: string
  label: string
  type: PageFieldType
  placeholder?: string
  options?: { value: string; label: string }[]
  itemLabel?: string
  itemFields?: PageField[]
}

export type PageSectionSchema = {
  key: string
  title: string
  description?: string
  fields: PageField[]
}

export type PageSchema = {
  key: PageKey
  label: string
  description: string
  sections: PageSectionSchema[]
}

export const PAGE_FIELDS: PageSchema[] = [
  {
    key: "home",
    label: "Accueil",
    description: "Sections de la page d'accueil",
    sections: [
      {
        key: "hero",
        title: "Bannière héro",
        description: "Image de fond de la grande bannière d'accueil",
        fields: [
          { key: "image", label: "Image de fond", type: "image" },
        ],
      },
      {
        key: "stats",
        title: "Chiffres clés",
        description: "Les statistiques affichées sous la section héro. Utilisez {count} pour le nombre d'annonces actives.",
        fields: [
          {
            key: "items",
            label: "Statistiques",
            type: "list",
            itemLabel: "Statistique",
            itemFields: [
              { key: "value", label: "Valeur", type: "input", placeholder: "{count}" },
              { key: "label", label: "Libellé", type: "input", placeholder: "Annonces actives" },
            ],
          },
        ],
      },
      {
        key: "featured",
        title: "Annonces en avant",
        description: "Section des annonces mises en avant",
        fields: [
          { key: "title", label: "Titre", type: "input" },
          { key: "subtitle", label: "Sous-titre", type: "input" },
          { key: "linkLabel", label: "Libellé du lien", type: "input" },
        ],
      },
      {
        key: "latest",
        title: "Dernières annonces",
        description: "Section des dernières annonces",
        fields: [
          { key: "title", label: "Titre", type: "input" },
          { key: "subtitle", label: "Sous-titre", type: "input" },
          { key: "linkLabel", label: "Libellé du lien", type: "input" },
        ],
      },
      {
        key: "landTypes",
        title: "Types de terrains",
        description: "Section des liens vers les types de terrains",
        fields: [
          { key: "title", label: "Titre", type: "input" },
          { key: "subtitle", label: "Sous-titre", type: "input" },
        ],
      },
      {
        key: "features",
        title: "Atouts de la plateforme",
        description: "Les avantages mis en avant en bas de page",
        fields: [
          {
            key: "items",
            label: "Atouts",
            type: "list",
            itemLabel: "Atout",
            itemFields: [
              {
                key: "icon",
                label: "Icône",
                type: "select",
                options: [
                  { value: "map", label: "Carte" },
                  { value: "sparkles", label: "Étincelles" },
                  { value: "shield", label: "Bouclier" },
                  { value: "search", label: "Loupe" },
                  { value: "home", label: "Maison" },
                  { value: "tree-pine", label: "Arbre" },
                  { value: "trending-up", label: "Croissance" },
                  { value: "badge-check", label: "Badge vérifié" },
                  { value: "clock", label: "Horloge" },
                  { value: "building-2", label: "Immeuble" },
                ],
              },
              { key: "title", label: "Titre", type: "input" },
              { key: "description", label: "Description", type: "textarea" },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "villes",
    label: "Villes",
    description: "Page d'annuaire des villes",
    sections: [
      {
        key: "hero",
        title: "Bannière héro",
        description: "Bannière affichée en haut de la page",
        fields: [
          { key: "image", label: "Image de fond", type: "image" },
          { key: "ctaLabel", label: "Texte du bouton", type: "input" },
          { key: "ctaUrl", label: "Lien du bouton", type: "input" },
          { key: "enabled", label: "Afficher la bannière héro", type: "checkbox" },
        ],
      },
    ],
  },
  {
    key: "types",
    label: "Types de terrain",
    description: "Page d'annuaire des types de terrains",
    sections: [
      {
        key: "hero",
        title: "Bannière héro",
        description: "Bannière affichée en haut de la page",
        fields: [
          { key: "image", label: "Image de fond", type: "image" },
          { key: "ctaLabel", label: "Texte du bouton", type: "input" },
          { key: "ctaUrl", label: "Lien du bouton", type: "input" },
          { key: "enabled", label: "Afficher la bannière héro", type: "checkbox" },
        ],
      },
    ],
  },
  {
    key: "departements",
    label: "Départements",
    description: "Page d'annuaire des départements",
    sections: [
      {
        key: "hero",
        title: "Bannière héro",
        description: "Bannière affichée en haut de la page",
        fields: [
          { key: "image", label: "Image de fond", type: "image" },
          { key: "ctaLabel", label: "Texte du bouton", type: "input" },
          { key: "ctaUrl", label: "Lien du bouton", type: "input" },
          { key: "enabled", label: "Afficher la bannière héro", type: "checkbox" },
        ],
      },
    ],
  },
  {
    key: "faq",
    label: "FAQ",
    description: "En-tête de la page des questions fréquentes",
    sections: [
      {
        key: "hero",
        title: "Bannière héro",
        description: "Bannière affichée en haut de la page",
        fields: [
          { key: "image", label: "Image de fond", type: "image" },
          { key: "ctaLabel", label: "Texte du bouton", type: "input" },
          { key: "ctaUrl", label: "Lien du bouton", type: "input" },
          { key: "enabled", label: "Afficher la bannière héro", type: "checkbox" },
        ],
      },
    ],
  },
  {
    key: "recherche",
    label: "Recherche",
    description: "Textes de la page de recherche",
    sections: [
      {
        key: "hero",
        title: "Bannière héro",
        description: "Bannière affichée en haut de la page",
        fields: [
          { key: "image", label: "Image de fond", type: "image" },
          { key: "ctaLabel", label: "Texte du bouton", type: "input" },
          { key: "ctaUrl", label: "Lien du bouton", type: "input" },
          { key: "enabled", label: "Afficher la bannière héro", type: "checkbox" },
        ],
      },
      {
        key: "empty",
        title: "Aucun résultat",
        description: "Textes affichés quand aucune annonce n'est trouvée",
        fields: [
          { key: "title", label: "Titre", type: "input" },
          { key: "text", label: "Texte", type: "input" },
        ],
      },
    ],
  },
]
