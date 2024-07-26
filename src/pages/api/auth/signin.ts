import type { APIRoute } from "astro";
import { fetchGuest } from "../../../firebase/services/getters";
import type { DocumentData } from "firebase-admin/firestore";

export const TOKEN_PREFIX = 'BMJ_';

export const POST: APIRoute = async ({ request }) => {

  const body = await request.json();

  try {

    const firstName = body.firstName;
    const lastName = body.lastName;
    const password = (body.password || '').replace(/\s/g, '')

    if (password != ('boda2024').toLowerCase()) {
      console.log('Wrong password:', firstName, lastName, password);
      return new Response( JSON.stringify({error: 'wrong password or user'}), { status: 400 });

    } else {
      const guest: DocumentData | undefined = await fetchGuest(firstName, lastName);
      if(guest) console.log('User logged in:', guest.firstName, guest.lastName);

      else console.log('User not found:', firstName, lastName);

      return getLoginResponse(guest?.id);
    }

  } catch (error) {

    console.error(error)
    return new Response("Something went wrong", {
      status: 500,
    });
  }
}

function getLoginResponse(guestId: string = 'unchecked') {
  const authToken = TOKEN_PREFIX + guestId;

  return new Response(JSON.stringify({token: authToken}), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
