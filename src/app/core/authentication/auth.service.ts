import { inject, Injectable, NgZone } from '@angular/core';
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
  getDoc,
  getDocs,
  query,
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
  private _ngZone = inject(NgZone);
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

  async register(email: string, password: string, name: string) {
    return createUserWithEmailAndPassword(this._auth, email, password)
      .then((res) => {
        this.userData = res.user;
        this._ngZone.run(() => {
          this.sendEmailVerification();
          this._setUserData(res, name);
          this._router.navigate(['/home']);
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  async login(email: string, password: string): Promise<IUser> {
    return signInWithEmailAndPassword(
      this._auth,
      email.trim(),
      password.trim()
    ).then((auth) => {
      this.email = email;
      return this._setUserData(auth);
    });
  }

  private _setUserData(
    auth: UserCredential,
    name: string = 'unknown'
  ): Promise<IUser> {
    if (this._auth.currentUser)
      updateProfile(this._auth.currentUser, {
        displayName: name,
        photoURL: auth.user.photoURL || '/assets/no profile photo.jpg',
      });
    const user: IUser = {
      id: auth.user.uid,
      email: auth.user.email,
      name: auth.user.displayName || name,
      lastSignInTime: auth.user.metadata.lastSignInTime,
      photoURL: auth.user.photoURL || '/assets/no profile photo.jpg',
    };
    console.log('user', user);
    const userDocRef = doc(this._firestore, `users/${user.id}`);
    return setDoc(userDocRef, user).then(() => user);
  }

  updateProfile(currentUser: User, updateData: IUpdateProfile): Promise<void> {
    return updateProfile(currentUser, updateData);
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

  async sendPasswordResetEmails(email: string) {
    sendPasswordResetEmail(this._auth, email)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  sendEmailVerification() {
    return sendEmailVerification(this._auth.currentUser as User);
  }

  logout(): Promise<void> {
    return signOut(this._auth);
  }
}
