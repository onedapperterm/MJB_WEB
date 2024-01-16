import type { APIRoute } from "astro";
import { firestore } from "../../../firebase/server";

export interface Guest {
  amount: number;
  familyName: string;
  checked: boolean;
  confirmed: boolean;
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  try {

    const guestsSnapshot = await firestore.collection('guests').get();
    const guestList: Guest[] = guestsSnapshot.docs.map(doc => doc.data() as Guest);

    const guest: Guest | undefined = guestList.find(guest => guest.familyName === body.guestName);
    if (!guest) {
      return new Response( JSON.stringify({error: 'wrong password or user'}), { status: 400, headers: { location: "/" } });
    } else {
      // logic to create the cookie or session
      return new Response(JSON.stringify(guest), {status: 200});
    }


  } catch (error) {

    console.error(error)

    return new Response("Something went wrong", {
      status: 500,
    });
  }

}

