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
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from '@angular/fire/auth';
import { IUser } from '../../shared/models/user.model';
import {
  collection,
  doc,
  Firestore,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { setDoc } from '@firebase/firestore';
import { IUpdateProfile } from '../../shared/models/profileManipulations.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _firestore = inject(Firestore);
  private _auth = inject(Auth);
  private _router = inject(Router);

  authState$ = authState(this._auth);
  user$ = user(this._auth);
  idToken$ = idToken(this._auth);

  email!: string;

  userData: any;

  constructor() {
    onAuthStateChanged(this._auth, (user: any) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  getAuthFire() {
    return this._auth.currentUser;
  }

  get isLoggedIn(): boolean {
    const token = localStorage.getItem('user');
    const user = JSON.parse(token as string);
    return user !== null ? true : false;
  }

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<string> {
    return createUserWithEmailAndPassword(
      this._auth,
      email.trim(),
      password.trim()
    )
      .then((res) => {
        this.userData = res.user;
        this.sendEmailVerification();
        this._setUserData(res, name.trim());
        localStorage.setItem('user', 'null');
        return 'Your account successfully registered. Check your inbox to activate an account';
      })
      .catch((error) => {
        return error.message;
      });
  }

  async login(email: string, password: string): Promise<IUser> {
    return signInWithEmailAndPassword(
      this._auth,
      email.trim(),
      password.trim()
    ).then((auth) => {
      this.email = email;
      return this._setUserData(auth, auth.user.displayName);
    });
  }

  private _setUserData(
    auth: UserCredential,
    name: string | null
  ): Promise<IUser> {
    if (this._auth.currentUser)
      updateProfile(this._auth.currentUser, {
        displayName: name,
        photoURL: auth.user.photoURL || '/assets/images/no profile photo.jpg',
      });
    const user: IUser = {
      id: auth.user.uid,
      email: auth.user.email,
      name: auth.user.displayName || name,
      lastSignInTime: auth.user.metadata.lastSignInTime,
      photoURL: auth.user.photoURL || '/assets/images/no profile photo.jpg',
    };
    const userDocRef = doc(this._firestore, `users/${user.id}`);
    return setDoc(userDocRef, user).then(() => user);
  }

  updateProfile(currentUser: User, updateData: IUpdateProfile): Promise<void> {
    return updateProfile(currentUser, updateData);
  }

  async updateUserData(userId: string, updateData: IUpdateProfile) {
    const userRef = doc(this._firestore, `users/${userId}`);

    await updateDoc(userRef, {
      name: updateData.displayName,
      photoURL: updateData.photoURL,
    });
  }

  async retrieveUserData(email: string): Promise<IUser[]> {
    const q = query(
      collection(this._firestore, 'users'),
      where('email', '==', email)
    );

    const querySnapshot = await getDocs(q);
    let returnArr: IUser[] = [];

    querySnapshot.forEach((doc) => {
      returnArr.push(doc.data() as IUser);
    });
    return returnArr;
  }

  googleAuth() {
    return this.loginWithPopup(new GoogleAuthProvider());
  }

  loginWithPopup(provider: any) {
    return signInWithPopup(this._auth, provider).then(() => {
      this._router.navigate(['home']);
    });
  }

  async sendPasswordResetEmails(email: string): Promise<string> {
    return sendPasswordResetEmail(this._auth, email)
      .then(() => {
        return 'Password reset email sent, check your inbox.';
      })
      .catch((error) => {
        return error.message;
      });
  }

  sendEmailVerification() {
    return sendEmailVerification(this._auth.currentUser as User);
  }

  logout(): Promise<void> {
    localStorage.removeItem('phone');
    return signOut(this._auth);
  }

  async deleteAccount(): Promise<string> {
    const user = this._auth.currentUser;
    return user
      ?.delete()
      .then(() => {
        return 'Goodbay, my friend. I hope you will come back soon!';
      })
      .catch((error) => {
        return error.message;
      });
  }
}
