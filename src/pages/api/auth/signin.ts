import type { APIRoute } from "astro";
import { firestore } from "../../../firebase/server";
import { serialize } from 'cookie';
import type { DocumentData } from "firebase-admin/firestore";

const COOKIE_NAME = 'bmjToken';

export interface Guest {
  reference: string;
  firstName: string;
  lastName: string;
  allowed: boolean;
  checked: boolean; //TODO: implement logic to persist checked
  confirmed: boolean; //TODO: implement logic to persist confirmed
}

export const POST: APIRoute = async ({ request }) => {

  const body = await request.json();

  try {

    const firstName = capitalizeWord(body.firstName);
    const lastName = capitalizeWord(body.lastName);
    const password = body.password || '';

    const queryRef = firestore.collection('guests')
      .where('firstName', '==' , firstName)
      .where('lastName', '==' , lastName);

    const querySnapshot = await queryRef.get();

    const guest: DocumentData | undefined = querySnapshot?.docs[0]?.data();

    if (!guest || !guest.allowed || password != (guest.firstName + '#boda2024').toLowerCase()) {
      return new Response( JSON.stringify({error: 'wrong password or user'}), { status: 400 });
    } else {

      const authToken = 'boda_may_juli_test_token'; // TODO:generate a secure token here

      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: true,
        maxAge: 60 * 60 * 24 * 1, // cookie expiration time = 1 day
        path: '/', 
      };

      const cookieHeader = serialize(COOKIE_NAME, authToken, cookieOptions);

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

function capitalizeWord(word: string | unknown): string {
  if (typeof word == 'string') {
    return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
  } else {
    return '';
  }
}
