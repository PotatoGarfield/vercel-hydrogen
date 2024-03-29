import {json} from '@vercel/remix';
import invariant from 'tiny-invariant';

import {
  PRODUCT_CARD_FRAGMENT,
  FEATURED_COLLECTION_FRAGMENT,
} from '~/data/fragments';

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context: {storefront}}) {
  return json(await getFeaturedData(storefront));
}

/**
 * @param {LoaderFunctionArgs['context']['storefront']} storefront
 * @param {{pageBy?: number}} [variables={}]
 */
export async function getFeaturedData(storefront, variables = {}) {
  const data = await storefront.query(FEATURED_ITEMS_QUERY, {
    variables: {
      pageBy: 12,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
      ...variables,
    },
  });

  invariant(data, 'No featured items data returned from Shopify API');

  return data;
}

export const FEATURED_ITEMS_QUERY = `#graphql
  query FeaturedItems(
    $country: CountryCode
    $language: LanguageCode
    $pageBy: Int = 12
  ) @inContext(country: $country, language: $language) {
    featuredCollections: collections(first: 3, sortKey: UPDATED_AT) {
      nodes {
        ...FeaturedCollectionDetails
      }
    }
    featuredProducts: products(first: $pageBy) {
      nodes {
        ...ProductCard
      }
    }
  }

  ${PRODUCT_CARD_FRAGMENT}
  ${FEATURED_COLLECTION_FRAGMENT}
`;

/** @typedef {Class<getFeaturedData>>>} FeaturedData */

/** @typedef {import('@vercel/remix').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@vercel/remix').SerializeFrom<typeof loader>} LoaderReturnData */
