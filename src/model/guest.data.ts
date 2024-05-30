export interface Guest {
  reference: string;
  firstName: string;
  lastName: string;
  allowed: boolean;
  checked: boolean; //TODO: implement logic to persist checked
  confirmed: boolean; //TODO: implement logic to persist confirmed
}

