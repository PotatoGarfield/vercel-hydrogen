import {redirect} from '@vercel/remix';

/**
 * @param {AppLoadContext} context
 */
export async function doLogout(context) {
  const {session} = context;
  session.unset('customerAccessToken');

  // The only file where I have to explicitly type cast i18n to pass typecheck
  return redirect(`${context.storefront.i18n.pathPrefix}/account/login`, {
    headers: {
      'Set-Cookie': await session.commit(),
    },
  });
}

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  return redirect(context.storefront.i18n.pathPrefix);
}

/**
 * @param {ActionFunctionArgs}
 */
export const action = async ({context}) => {
  return doLogout(context);
};

/** @typedef {import('@vercel/remix').ActionFunction} ActionFunction */
/** @typedef {import('@vercel/remix').AppLoadContext} AppLoadContext */
/** @typedef {import('@vercel/remix').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@vercel/remix').ActionFunctionArgs} ActionFunctionArgs */
/** @typedef {import('@vercel/remix').SerializeFrom<typeof loader>} LoaderReturnData */
