import {createStorefrontClient} from '@shopify/hydrogen';
import {createRequestHandler} from '@vercel/remix';

export default {
  async fetch(request, env, executionContext) {
    const {storefront} = createStorefrontClient({
      // Required: Storefront API credentials
      privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
      publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      storefrontApiVersion: env.PUBLIC_STOREFRONT_API_VERSION,
      storeDomain: `https://${env.PUBLIC_STORE_DOMAIN}`,
      storefrontHeaders: {
        // Pass a buyerIp to prevent being flagged as a bot
        buyerIp: 'customer_IP_address', // Platform-specific method to get request IP
        cookie: request.headers.get('cookie'),  // Required for Shopify Analytics
        purpose: request.headers.get('purpose'), // Used for debugging purposes
      },
      i18n: {
        country: 'country_code',
        language: 'language_code',
      },
      cache: () => {},
      waitUntil: () => {},
      // Additional platform-specific configuration...
    });
    const handleRequest = createRequestHandler({
      // Inject the Storefront API client into the Remix context
      getLoadContext: () => ({storefront}),
      // Additional platform-specific configuration...
    });
    return handleRequest(request);
  },
};
