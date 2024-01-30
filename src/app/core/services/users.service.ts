import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { IUser } from '../../shared/models/user.model';

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
}
