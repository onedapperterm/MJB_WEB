import type { Guest, GuestAllergiesCreateDTO, GuestConfirmationDTO, GuestMessageCreateDTO, GuestPartySuggestionsCreateDTO, GuestSongSuggestionsCreateDTO } from "@/model/guest.data.ts";
import { firestore } from "../server.ts";
import { fetchGuest } from "./getters.ts";

export async function confirmGuest(dto: GuestConfirmationDTO): Promise<boolean> {
  const guest = await fetchGuest(dto.firstName, dto.lastName);

  try {
    if(guest) {
      const updatedGuest: Guest = {
        ...guest, 
        checked: true,
        confirmed: true,
        attendance: dto.attendance,
        stayAtHotel: dto.stayAtHotel,
        updatedAt: dto.updatedAt
      };
      const updateSuccess = await updateGuest(updatedGuest);

      if(updateSuccess) {
        const processSuccess = await processGuestData(guest, dto);

        if(!processSuccess) console.warn('Error processing guest data');
        else console.log('Guest Data confirmed successfully');
      }

      return updateSuccess;
    } else {
      console.warn('Guest not found');
      return await createUncheckedConfirmation(dto);
    }
  } catch (error) {
    console.error('Error confirming guest', error);
    return false;
  }
}

async function processGuestData(guest: Guest, dto: GuestConfirmationDTO): Promise<boolean> {
  const results = await Promise.all([
    createGuestAllergies({
      allergies: dto.allergies,
      guestId: guest.id,
      guestName: `${guest.firstName} ${guest.lastName}`
    }),
    createGuestSongSuggestions({
      songSuggestions: dto.songSuggestions,
      guestId: guest.id,
      guestName: `${guest.firstName} ${guest.lastName}`
    }),
    createGuestPartySuggestions({
      partySuggestions: dto.partySuggestions,
      guestId: guest.id,
      guestName: `${guest.firstName} ${guest.lastName}`
    }),
    createGuestMessage({
      message: dto.message,
      guestId: guest.id,
      guestName: `${guest.firstName} ${guest.lastName}`
    })
  ]);

  return results.every(result => result === true);
}

export async function updateGuest(guest: Guest): Promise<boolean> {
  const { id, ...guestData } = guest;
  try {
    await firestore.collection('guests').doc(id).set(guestData, { merge: true });
    return true;
  } catch (error) {
    console.log('Error updating guest', error);
    return false;
  }
}

export async function updateGuestsBatch(guests: Guest[]): Promise<boolean> {
  try {
    const batch = firestore.batch();
    guests.forEach(guest => {
      const { id, ...guestData } = guest;
      const docRef = firestore.collection('guests').doc(id);
      batch.set(docRef, guestData);
    });
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error updating guests', error);
    return false;
  }
}


export async function createUncheckedConfirmation(dto: GuestConfirmationDTO): Promise<boolean> {
  const normalizedDto = removeEmptyValues(dto); 
  try {
    await firestore.collection('unchecked-confirmations').add(normalizedDto);
    return true;
  } catch (error) {
    console.error('Error creating unchecked confirmation', error);
    return false;
  }
}

export async function createGuestAllergies(dto: GuestAllergiesCreateDTO): Promise<boolean> {
  if(!dto.allergies?.length) return true;
  try {
    await firestore.collection('guest-allergies').add(dto);
    return true;
  } catch (error) {
    console.error('Error creating guest allergies', error);
    return false;
  }
}

export async function createGuestSongSuggestions(dto: GuestSongSuggestionsCreateDTO): Promise<boolean> {
  if(!dto.songSuggestions?.length) return true;
  try {
    await firestore.collection('guest-song-suggestions').add(dto);
    return true;
  } catch (error) {
    console.error('Error creating guest song suggestions', error);
    return false;
  }
}

export async function createGuestPartySuggestions(dto: GuestPartySuggestionsCreateDTO): Promise<boolean> {
  if(dto.partySuggestions.trim() === '') return true;
  try {
    await firestore.collection('guest-party-suggestions').add(dto);
    return true;
  } catch (error) {
    console.error('Error creating guest party suggestions', error);
    return false;
  }
}

export async function createGuestMessage(dto: GuestMessageCreateDTO): Promise<boolean> {
  if(dto.message.trim() === '') return true;
  try {
    await firestore.collection('guest-messages').add(dto);
    return true;
  } catch (error) {
    console.error('Error creating guest message', error);
    return false;
  }
}

//HACK: This function is a workaround to remove empty values from DTOs
function removeEmptyValues<T extends Record<string, any>>(dto: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key in dto) {
    const value = dto[key];
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        if (value.length > 0 && value.some((item: any) => item !== '')) {
          result[key] = value.filter((item: any) => item !== '');
        }
      } else if (typeof value === 'object') {
        const nestedResult = removeEmptyValues(value);
        if (Object.keys(nestedResult).length > 0) {
          result[key] = nestedResult as any;
        }
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}
