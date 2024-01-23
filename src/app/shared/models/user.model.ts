export interface IUser {
  id: string;
  email: string | null;
  lastSignInTime?: string;
  photoURL: string | null;
}
