import type { APIContext, MiddlewareNext } from "astro";
import { sequence } from "astro:middleware";
import { parse } from "cookie";

const COOKIE_NAME = 'bmjToken';

async function auth({request}: APIContext, next: MiddlewareNext) {

  const url = new URL(request.url);

  const isAuthenticated = checkAuthentication(request);
  const isPublicUrl = url.pathname == "/api/auth/signin" || url.pathname == "/";

  if(!isAuthenticated && isPublicUrl) {
    const response = await next();
    return response;
  }

  if(isAuthenticated && isPublicUrl) {
    return new Response( 'authorized user -> redirected', { status: 302, headers: { location: "/home" } });
  }

  if (!isAuthenticated) {
    return new Response( 'unauthorized user -> redirected', { status: 302, headers: { location: "/" } });
  }

  const response = await next();
  return response;
}

export function checkAuthentication(request: Request) {
  const cookies = parse(request.headers.get('Cookie') || '');

  const authToken = cookies[COOKIE_NAME];

  return authToken == 'boda_may_juli_test_token';
}

export const onRequest = sequence(auth);
