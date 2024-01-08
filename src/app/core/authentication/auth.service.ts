import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  idToken,
  signInWithEmailAndPassword,
  user,
  UserCredential,
  signOut,
} from '@angular/fire/auth';
import { User } from '../../shared/models/user.model';
import { doc, Firestore } from '@angular/fire/firestore';
import { setDoc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _firestore = inject(Firestore);
  private _auth = inject(Auth);

  authState$ = authState(this._auth);
  user$ = user(this._auth);
  idToken$ = idToken(this._auth);

  email!: string;

  login(email: string, password: string): Promise<User> {
    return signInWithEmailAndPassword(
      this._auth,
      email.trim(),
      password.trim()
    ).then((auth) => {
      this.email = email;
      return this._setUserData(auth);
    });
  }

  private _setUserData(auth: UserCredential): Promise<User> {
    const user: User = {
      id: auth.user.uid,
      email: auth.user.email,
      lastSignInTime: auth.user.metadata.lastSignInTime,
    };
    const userDocRef = doc(this._firestore, `users/${user.id}`);
    return setDoc(userDocRef, user).then(() => user);
  }

  logout(): Promise<void> {
    return signOut(this._auth);
  }
}
