import { Metadata } from 'next';

export const dynamic = 'force-static';

export function GET() {
  const robots = `# Google Search Console & Crawlers
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /painel/

# Sitemaps
Sitemap: https://arclar.com.br/sitemap.xml
`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

