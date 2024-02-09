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

  async addNewBookmark(email: string, entity: string, entityItemId: string) {
    await setDoc(
      doc(this._firestore, 'bookmarksByUser', email, entity, entityItemId),
      {
        entityItemId,
      }
    ).then(() => {
      this.setBookmarkInUserData(email, entityItemId, entity);
    });
  }

  async checkUserHasBookmark(
    email: string,
    entity: string,
    entityItemId: string
  ): Promise<boolean> {
    const docRef = doc(
      this._firestore,
      'bookmarksByUser',
      email,
      entity,
      entityItemId
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return true;
    } else {
      return false;
    }
  }

  async deleteBookmark(email: string, entity: string, entityItemId: string) {
    await deleteDoc(
      doc(this._firestore, 'bookmarksByUser', email, entity, entityItemId)
    ).then(() => {
      this.deleteBookmarkInUserData(email, entityItemId);
    });
  }

  async setBookmarkInUserData(
    email: string,
    entityItemId: string,
    entity: string
  ) {
    await setDoc(
      doc(this._firestore, 'usersData', email, 'bookmarks', entityItemId),
      { id: entityItemId, type: entity }
    );
  }

  async deleteBookmarkInUserData(email: string, entityItemId: string) {
    await deleteDoc(
      doc(this._firestore, 'usersData', email, 'bookmarks', entityItemId)
    );
  }

  async getAllBookmarksInUserData(
    email: string,
    entity: string
  ): Promise<Array<string>> {
    let bookmarks: Array<string> = [];
    const querySnapshot = await getDocs(
      query(
        collection(this._firestore, 'usersData', email, 'bookmarks'),
        where('type', '==', entity)
      )
    );

    querySnapshot.forEach((doc) => {
      const bookmarkData = doc.data()['id'] as string;

      bookmarks.push(bookmarkData);
    });

    return bookmarks;
  }

  async getAllBookmarks(
    entity: string,
    userEmail: string | null | undefined
  ): Promise<string[] | undefined> {
    try {
      if (!userEmail) return;
      const res = await this.getAllBookmarksInUserData(userEmail, entity);

      return res;
    } catch (error) {
      throw error;
    }
  }
}
