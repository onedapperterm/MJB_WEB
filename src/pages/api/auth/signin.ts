import type { APIRoute } from "astro";
import { firestore } from "../../../firebase/server";
import { serialize } from 'cookie';
import type { DocumentData } from "firebase-admin/firestore";

const COOKIE_NAME = 'bmjToken';

export const POST: APIRoute = async ({ request }) => {

  const body = await request.json();

  try {

    const firstName = body.firstName;
    const lastName = body.lastName;
    const password = (body.password || '').replace(/\s/g, '')

    if (password != ('boda2024').toLowerCase()) {
      console.log('Wrong password or user:', firstName, lastName, password);
      return new Response( JSON.stringify({error: 'wrong password or user'}), { status: 400 });

    } else {
      const guest: DocumentData | undefined = await fetchGuest(firstName, lastName);
      if(guest) console.log('User logged in:', guest.firstName, guest.lastName);
      else console.log('User not found:', firstName, lastName);

      return getLoginResponse();
    }

  } catch (error) {

    console.error(error)
    return new Response("Something went wrong", {
      status: 500,
    });
  }

}

async function fetchGuest(firstName: string, lastName: string): Promise<DocumentData | undefined>{
  const queryRef = firestore.collection('guests')
    .where('firstName', '==' , firstName)
    .where('lastName', '==' , lastName);

  const querySnapshot = await queryRef.get();

  return querySnapshot?.docs[0]?.data();
}

function getLoginResponse() {
  const authToken = 'boda_may_juli_test_token'; // TODO:generate a secure token here

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: true,
    maxAge: 60 * 60 * 24 * 7, // cookie expiration time = 7 days
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
