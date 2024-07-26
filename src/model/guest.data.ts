export interface Session {
  id: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
}

export interface GuestLoginDto {
  firstName: string,
  lastName: string,
  password: string
}

export interface GuestConfirmationDTO {
  firstName: string;
  lastName: string;
  attendance: boolean;
  stayAtHotel: boolean;
  songSuggestions: string[];
  allergies: string[];
  partySuggestions: string;
  message: string;
  updatedAt: string;
  referencia: string; //NOTE: Just a honepot for spam bots
}

export interface Guest extends Omit<Partial<GuestConfirmationDTO>, 'songSuggestions' | 'allergies' | 'partySuggestions' | 'message' | 'referencia'> {
  id: string;
  reference: string;
  allowed: boolean;
  confirmed: boolean; 
  checked: boolean;
}

export interface UncheckedConfirmation extends Partial<GuestConfirmationDTO> {
  id: string;
  firstName: string;
  lastName: string;
  attendance: boolean;
}

export interface GuestAllergies {
  id: string;
  allergies: string[];
  guestId: string;
  guestName: string;
}

export interface GuestAllergiesCreateDTO extends Omit<GuestAllergies, 'id'> {}

export interface GuestSongSuggestions {
  id: string;
  songSuggestions: string[];
  guestId: string;
  guestName: string;
}

export interface GuestSongSuggestionsCreateDTO extends Omit<GuestSongSuggestions, 'id'> {}

export interface GuestPartySuggestions {
  id: string;
  partySuggestions: string;
  guestId: string;
  guestName: string;
}

export interface GuestPartySuggestionsCreateDTO extends Omit<GuestPartySuggestions, 'id'> {}

export interface GuestMessage {
  id: string;
  message: string;
  guestId: string;
  guestName: string;
}

export interface GuestMessageCreateDTO extends Omit<GuestMessage, 'id'> {}
