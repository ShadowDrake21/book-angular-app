import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
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
    console.log('updateObj: ', updateObj);
    await updateDoc(docRef, updateObj);

    console.log('document updated with id:', docRef.id);
  }
}
