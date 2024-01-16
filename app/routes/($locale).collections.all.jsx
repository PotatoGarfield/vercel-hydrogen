import {redirect} from '@vercel/remix';

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({params}) {
  return redirect(params?.locale ? `${params.locale}/products` : '/products');
}

/** @typedef {import('@vercel/remix').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@vercel/remix').SerializeFrom<typeof loader>} LoaderReturnData */
