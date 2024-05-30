import type { APIRoute } from "astro";
import { firestore } from "../../../firebase/server";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  console.log('body:', body);

  const collectionRef = firestore.collection('guests');


  return new Response(JSON.stringify({message: 'Hello from the API'}), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export const GET: APIRoute = async () => {
  const collectionRef = firestore.collection('guests');

  const querySnapshot = await collectionRef.get();

  const guests = querySnapshot.docs.map(doc => doc.data());

  return new Response(JSON.stringify(guests), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
