import Link from "next/link"

type Props = {
  title: string
  subtitle?: string
  image?: string
  ctaLabel?: string
  ctaUrl?: string
  children?: React.ReactNode
}

export function PageHero({ title, subtitle, image, ctaLabel, ctaUrl, children }: Props) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 py-16 md:py-24">
      {image && (
        <>
          <div className="absolute inset-0">
            <img src={image} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-emerald-950/70" />
        </>
      )}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {title && (
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8">
            {subtitle}
          </p>
        )}
        {ctaLabel && ctaUrl && (
          <Link
            href={ctaUrl}
            className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {ctaLabel}
          </Link>
        )}
        {children}
      </div>
    </section>
  )
}
