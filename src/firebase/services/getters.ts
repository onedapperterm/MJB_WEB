import { firestore } from "../server.ts";
import type { Guest } from "@/model/guest.data.ts";

export async function fetchGuestById(id: string): Promise<Guest | undefined> {
  const docRef = firestore.collection('guests').doc(id);
  const doc = await docRef.get();

  if(doc.exists) {
    const guest: Guest = {
      ...(doc.data() as Guest),
      id: doc.id
    }
    return guest;
  } else {
    return undefined;
  }
}

export async function fetchGuest(firstName: string, lastName: string): Promise<Guest | undefined>{
  const normalizedFirstName = capitalizeName(firstName);
  const normalizedLastName = capitalizeName(lastName);

  const queryRef = firestore.collection('guests')
    .where('firstName', '==' , normalizedFirstName)
    .where('lastName', '==' , normalizedLastName)
    .orderBy('reference', 'desc');

  const querySnapshot = await queryRef.get()
  const docId = querySnapshot?.docs[0]?.id;

  if(docId) {
    const guest: Guest = {
      ...(querySnapshot?.docs[0]?.data() as Guest),
      id: docId
    }
    return guest;
  } else {
    return undefined;
  }
}

export async function fetchGuestsByReference(reference: string): Promise<Guest[] | undefined> {
  const queryRef = firestore.collection('guests')
  .where('reference', '==' , reference);

  try {
    const querySnapshot = await queryRef.get()
    const guests: Guest[] = querySnapshot.docs.map(doc => {
      return {
        ...(doc.data() as Guest),
        id: doc.id
      }
    });

    return guests;
  } catch (error) {
    console.log('Error fetching guests by reference', error);
    return undefined;
  }
}

export async function fetchAllGuests(): Promise<Guest[] | undefined> {
  try {
    const querySnapshot = await firestore.collection('guests').get();
    const guests: Guest[] = querySnapshot.docs.map(doc => {
      return {
        ...(doc.data() as Guest),
        id: doc.id
      }
    });

    return guests;
  } catch (error) {
    console.log('Error fetching all guests', error);
    return undefined;
  }
}

function capitalizeName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}
