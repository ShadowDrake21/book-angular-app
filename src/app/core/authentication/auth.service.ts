import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  idToken,
  signInWithEmailAndPassword,
  user,
  User,
  UserCredential,
  signOut,
  updateProfile,
  getAuth,
} from '@angular/fire/auth';
import { IUser } from '../../shared/models/user.model';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { setDoc } from '@firebase/firestore';
import { IUpdateProfile } from '../../shared/models/profileManipulations.model';
import { Observable, Subscription } from 'rxjs';

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

  login(email: string, password: string): Promise<IUser> {
    return signInWithEmailAndPassword(
      this._auth,
      email.trim(),
      password.trim()
    ).then((auth) => {
      this.email = email;
      return this._setUserData(auth);
    });
  }

  private _setUserData(auth: UserCredential): Promise<IUser> {
    if (this._auth.currentUser)
      updateProfile(this._auth.currentUser, {
        photoURL: auth.user.photoURL || '/assets/no profile photo.jpg',
      });
    const user: IUser = {
      id: auth.user.uid,
      email: auth.user.email,
      lastSignInTime: auth.user.metadata.lastSignInTime,
    };
    const userDocRef = doc(this._firestore, `users/${user.id}`);
    return setDoc(userDocRef, user).then(() => user);
  }

  updateProfile(currentUser: User, updateData: IUpdateProfile): Promise<void> {
    return updateProfile(currentUser, updateData);
  }

  async retrieveUserData(email: string) {
    const q = query(
      collection(this._firestore, 'users'),
      where('email', '==', email)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log(doc.id, 'email =>', doc.data() as IUser);
    });
  }

  logout(): Promise<void> {
    return signOut(this._auth);
  }
}
