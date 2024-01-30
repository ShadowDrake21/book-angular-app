import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  private _firestore = inject(Firestore);

  async addNewBookmark(userId: string, entity: string, entityItemId: string) {
    await setDoc(
      doc(this._firestore, 'bookmarksByUser', userId, entity, entityItemId),
      {
        entityItemId,
      }
    );
  }

  async checkUserHasBookmark(
    userId: string,
    entity: string,
    entityItemId: string
  ): Promise<boolean> {
    const docRef = doc(
      this._firestore,
      'bookmarksByUser',
      userId,
      entity,
      entityItemId
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('bookmarked', docSnap.data());
      return true;
    } else {
      return false;
    }
  }

  async deleteBookmark(userId: string, entity: string, entityItemId: string) {
    await deleteDoc(
      doc(this._firestore, 'bookmarksByUser', userId, entity, entityItemId)
    );
  }
}
