import type { APIContext, MiddlewareNext } from "astro";
import { sequence } from "astro:middleware";

async function auth({request}: APIContext, next: MiddlewareNext) {

  const url = new URL(request.url);

  let isAuthenticated = true;

  if (!isAuthenticated && url.pathname.startsWith("/formular")) {
    return new Response( '', { status: 302, headers: { location: "/" } });
  }
    const response = await next();
    console.log("auth response");
    return response;
}


export const onRequest = sequence(auth);
