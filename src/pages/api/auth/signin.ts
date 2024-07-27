import type { APIRoute } from "astro";
import { fetchGuest } from "../../../firebase/services/getters";
import type { Guest } from "@/model/guest.data";
import { updateGuest } from "@/firebase/services/setters";

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
      const guest: Guest | undefined = await fetchGuest(firstName, lastName);

      if(!guest) console.log('User not found:', firstName, lastName)
      else console.log('User logged in:', guest.firstName, guest.lastName);

      if(!guest?.checked) await updateGuest({ ...guest as Guest, ...{checked: true}})

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
