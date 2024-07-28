import { TOKEN_PREFIX } from "@/pages/api/auth/signin";
import type { APIContext, MiddlewareNext } from "astro";
//@ts-ignore
import { sequence } from "astro:middleware";
import { parse } from "cookie";

const COOKIE_NAME = 'session_token';

async function auth({request}: APIContext, next: MiddlewareNext) {

  const url = new URL(request.url);

  const isAuthenticated = checkAuthentication(request);
  const isPublicUrl = url.pathname == "/api/auth/signin" || url.pathname == "/";
  const allowedUrls = ["/home", "/boda", "/historia", "/404", "/formular", ];

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

  if(!allowedUrls.includes(url.pathname)) {
    return new Response( 'authorized user -> redirected', { status: 302, headers: { location: "/home" } });
  }

  const response = await next();
  return response;
}

export function checkAuthentication(request: Request) {
  const cookies = parse(request.headers.get('Cookie') || '');

  const authToken = cookies[COOKIE_NAME];

  return authToken?.startsWith(TOKEN_PREFIX);
}

export const onRequest = sequence(auth);
