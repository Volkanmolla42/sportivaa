// Next.js 15 SEO: Otomatik sitemap
export default function sitemap() {
  return [
    {
      url: 'https://sportiva.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    // Diğer sayfalar için buraya ekleme yapabilirsin
  ];
}
