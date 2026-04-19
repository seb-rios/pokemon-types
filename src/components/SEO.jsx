import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'PokéTypeDex'
const BASE_URL = 'https://www.poketypedex.com'
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`

export default function SEO({ title, description, path = '/', image = DEFAULT_IMAGE }) {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — Pokémon Type Effectiveness Chart & Matchup Tool`

  const canonical = `${BASE_URL}${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description"        content={description} />
      <link rel="canonical"           href={canonical} />

      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url"         content={canonical} />
      <meta property="og:image"       content={image} />
      <meta property="og:type"        content="website" />

      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={image} />
    </Helmet>
  )
}
