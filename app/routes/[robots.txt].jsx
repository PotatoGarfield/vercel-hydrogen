/**
 * @param {LoaderFunctionArgs}
 */
export const loader = ({request}) => {
  const url = new URL(request.url);

  return new Response(robotsTxtData({url: url.origin}), {
    status: 200,
    headers: {
      'content-type': 'text/plain',
      // Cache for 24 hours
      'cache-control': `max-age=${60 * 60 * 24}`,
    },
  });
};

/**
 * @param {{url: string}}
 */
function robotsTxtData({url}) {
  const sitemapUrl = url ? `${url}/sitemap.xml` : undefined;

  return `
User-agent: *
Disallow: /admin
Disallow: /cart
Disallow: /orders
Disallow: /checkouts/
Disallow: /checkout
Disallow: /carts
Disallow: /account
${sitemapUrl ? `Sitemap: ${sitemapUrl}` : ''}

# Google adsbot ignores robots.txt unless specifically named!
User-agent: adsbot-google
Disallow: /checkouts/
Disallow: /checkout
Disallow: /carts
Disallow: /orders

User-agent: Pinterest
Crawl-delay: 1
`.trim();
}

/** @typedef {import('@vercel/remix').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@vercel/remix').SerializeFrom<typeof loader>} LoaderReturnData */
