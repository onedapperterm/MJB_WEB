import type { APIRoute } from "astro";
import { firestore } from "../../../firebase/server";

const COOKIE_NAME = 'bmjToken';

export interface Guest {
  amount: number;
  familyName: string;
  checked: boolean;
  confirmed: boolean;
}

export const POST: APIRoute = async ({ request }) => {

  const body = await request.json();

  try {

    const guestLogin = {
      firstName: (body.firstName as string).toLowerCase(),
      lastName: body.lastName,
      password: body.password
    }

    const guestsSnapshot = await firestore.collection('guests').get();
    const guestList: Guest[] = guestsSnapshot.docs.map((doc: any) => {
          let guest: Guest =  doc.data() as Guest;
          return {...guest, ...{familyName: guest?.familyName.toLowerCase()}};
        });

    const guest: Guest | undefined = guestList.find(guest => guest.familyName.includes(guestLogin.firstName));

    if (!guest || guestLogin.password != "12341234") {
      return new Response( JSON.stringify({error: 'wrong password or user'}), { status: 400 });
    } else {

      const authToken = 'boda_may_juli_test_token'; // TODO:generate a secure token here
      const maxAge = 60 * 60 * 24 * 1;

      const cookieHeader = `${COOKIE_NAME}=${authToken}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Strict`

      return new Response(JSON.stringify({cookie: cookieHeader}), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

  } catch (error) {

    console.error(error)
    return new Response("Something went wrong", {
      status: 500,
    });
  }

}

