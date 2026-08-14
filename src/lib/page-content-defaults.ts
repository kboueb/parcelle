export type PageKey = "home" | "villes" | "types" | "departements" | "faq" | "recherche"

export const PAGE_KEYS: PageKey[] = ["home", "villes", "types", "departements", "faq", "recherche"]

export const PAGE_LABELS: Record<PageKey, string> = {
  home: "Accueil",
  villes: "Villes",
  types: "Types de terrain",
  departements: "Départements",
  faq: "FAQ",
  recherche: "Recherche",
}

export type PageDefaults = {
  title: string
  subtitle: string
  seoTitle: string
  seoDescription: string
  sections: Record<string, unknown>
}

export const PAGE_DEFAULTS: Record<PageKey, PageDefaults> = {
  home: {
    title: "Trouvez le terrain idéal",
    subtitle: "Des milliers d'annonces de terrains et parcelles partout en France",
    seoTitle: "",
    seoDescription: "",
    sections: {
      hero: {
        image: "",
        enabled: true,
      },
      stats: {
        items: [
          { value: "{count}", label: "Annonces actives" },
          { value: "+{count15}", label: "Nouvelles / mois" },
          { value: "95%", label: "Satisfaction" },
          { value: "18", label: "Régions couvertes" },
        ],
      },
      featured: {
        title: "Annonces en avant",
        subtitle: "Nos sélections de terrains d'exception",
        linkLabel: "Voir tout",
      },
      latest: {
        title: "Dernières annonces",
        subtitle: "Les terrains fraîchement publiés",
        linkLabel: "Voir tout",
      },
      landTypes: {
        title: "Types de terrains",
        subtitle: "",
      },
      features: {
        items: [
          {
            icon: "map",
            title: "Recherche géographique",
            description:
              "Trouvez des terrains par ville, département ou région avec notre carte interactive.",
          },
          {
            icon: "sparkles",
            title: "Filtres avancés",
            description:
              "Affinez votre recherche par prix, surface, type de terrain et nombreux critères.",
          },
          {
            icon: "shield",
            title: "Annonces vérifiées",
            description:
              "Toutes les annonces sont modérées par notre équipe pour garantir leur fiabilité.",
          },
        ],
      },
    },
  },
  villes: {
    title: "Terrains à vendre par ville",
    subtitle: "Parcourez les annonces de terrains dans les principales villes de France",
    seoTitle: "Terrains à vendre par ville",
    seoDescription:
      "Retrouvez tous nos terrains et parcelles à vendre dans les principales villes de France.",
    sections: {
      hero: {
        image: "",
        ctaLabel: "",
        ctaUrl: "",
        enabled: true,
      },
    },
  },
  types: {
    title: "Types de terrains",
    subtitle: "Explorez les annonces par type de terrain",
    seoTitle: "Tous les types de terrains",
    seoDescription:
      "Découvrez tous les types de terrains disponibles : constructible, viabilisé, agricole, forestier, lotissement, non constructible.",
    sections: {
      hero: {
        image: "",
        ctaLabel: "",
        ctaUrl: "",
        enabled: true,
      },
    },
  },
  departements: {
    title: "Terrains à vendre par département",
    subtitle: "Parcourez les annonces par département",
    seoTitle: "Terrains à vendre par département",
    seoDescription: "Retrouvez tous nos terrains et parcelles à vendre par département.",
    sections: {
      hero: {
        image: "",
        ctaLabel: "",
        ctaUrl: "",
        enabled: true,
      },
    },
  },
  faq: {
    title: "Questions fréquentes",
    subtitle: "Tout ce que vous devez savoir sur l'achat et la location de terrains",
    seoTitle: "FAQ - Questions fréquentes",
    seoDescription:
      "Retrouvez les réponses aux questions les plus fréquentes sur l'achat et la location de terrains en France.",
    sections: {
      hero: {
        image: "",
        ctaLabel: "",
        ctaUrl: "",
        enabled: true,
      },
    },
  },
  recherche: {
    title: "Recherche de terrains",
    subtitle: "Trouvez le terrain idéal parmi des milliers d'annonces",
    seoTitle: "",
    seoDescription: "",
    sections: {
      hero: {
        image: "",
        ctaLabel: "",
        ctaUrl: "",
        enabled: true,
      },
      empty: {
        title: "Aucune annonce trouvée",
        text: "Essayez de modifier vos critères de recherche",
      },
    },
  },
}
