import {redirect} from '@vercel/remix';

/**
 * Automatically applies a discount found on the url
 * If a cart exists it's updated with the discount, otherwise a cart is created with the discount already applied
 * @example
 * Example path applying a discount and redirecting
 * ```ts
 * /discount/FREESHIPPING?redirect=/products
 *
 * ```
 * @preserve
 * @param {LoaderFunctionArgs}
 */
export async function loader({request, context, params}) {
  const {cart} = context;
  // N.B. This route will probably be removed in the future.
  const session = context.session;
  const {code} = params;

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  let redirectParam =
    searchParams.get('redirect') || searchParams.get('return_to') || '/';

  if (redirectParam.includes('//')) {
    // Avoid redirecting to external URLs to prevent phishing attacks
    redirectParam = '/';
  }

  searchParams.delete('redirect');
  searchParams.delete('return_to');

  const redirectUrl = `${redirectParam}?${searchParams}`;

  if (!code) {
    return redirect(redirectUrl);
  }

  const result = await cart.updateDiscountCodes([code]);
  const headers = cart.setCartId(result.cart.id);

  // Using set-cookie on a 303 redirect will not work if the domain origin have port number (:3000)
  // If there is no cart id and a new cart id is created in the progress, it will not be set in the cookie
  // on localhost:3000
  return redirect(redirectUrl, {
    status: 303,
    headers,
  });
}

/** @typedef {import('@vercel/remix').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@vercel/remix').SerializeFrom<typeof loader>} LoaderReturnData */
