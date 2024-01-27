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

  async addNewBookBookmark(userId: string, bookId: string) {
    await setDoc(
      doc(this._firestore, 'bookmarksByUser', userId, 'books', bookId),
      {
        bookId,
      }
    );
  }

  async checkUserHasBookBookmark(
    userId: string,
    bookId: string
  ): Promise<boolean> {
    const docRef = doc(
      this._firestore,
      'bookmarksByUser',
      userId,
      'books',
      bookId
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('bookmarked', docSnap.data());
      return true;
    } else {
      return false;
    }
  }

  async deleteBookBookmark(userId: string, bookId: string) {
    await deleteDoc(
      doc(this._firestore, 'bookmarksByUser', userId, 'books', bookId)
    );
  }
}
