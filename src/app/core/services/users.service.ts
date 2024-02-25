import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { IUser } from '../../shared/models/user.model';
import { IUpdateProfile } from '../../shared/models/profileManipulations.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private _firestore = inject(Firestore);

  async getAllUsers(): Promise<IUser[]> {
    let users: Array<IUser> = [];
    const querySnapshot = await getDocs(
      query(collection(this._firestore, 'users'), orderBy('email', 'asc'))
    );

    querySnapshot.forEach((doc) => {
      const user = doc.data() as IUser;

      users.push(user);
    });
    return users;
  }

  async getUserById(userId: string): Promise<IUser> {
    const docRef = doc(this._firestore, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as IUser;
    } else {
      return {
        id: 'unknown',
      } as IUser;
    }
  }

  async getUserByEmail(userEmail: string): Promise<IUser[]> {
    let users: Array<IUser> = [];
    const querySnapshot = await getDocs(
      query(
        collection(this._firestore, 'users'),
        where('email', '==', userEmail)
      )
    );

    querySnapshot.forEach((doc) => {
      const user = doc.data() as IUser;

      users.push(user);
    });
    return users;
  }

  async updateUser(email: string, updateDataObj: IUpdateProfile) {
    const docRef = doc(this._firestore, 'users', email);

    let updateObj: object = {
      photoURL: updateDataObj.photoURL,
    };
    await updateDoc(docRef, updateObj);
  }

  async deleteUser(userId: string) {
    await deleteDoc(doc(this._firestore, 'users', userId));
  }
}
