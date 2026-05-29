import type { MetadataRoute } from 'next'

const BASE = 'https://mornings.page'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/legal/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/legal/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
