export interface IUser {
  id: string;
  email: string | null;
  name: string | null;
  lastSignInTime?: string;
  photoURL: string | null;
}
