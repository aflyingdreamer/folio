import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/about', '/legal/'],
        disallow: [
          '/today',
          '/archive',
          '/settings',
          '/welcome',
          '/login',
          '/signup',
          '/forgot',
          '/reset',
          '/auth/',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://mornings.page/sitemap.xml',
    host: 'https://mornings.page',
  }
}
