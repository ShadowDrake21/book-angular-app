import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private _firestore = inject(Firestore);

  async getAllCommentsByBook(bookId: string) {
    const querySnapshot = await getDocs(
      collection(this._firestore, 'books', bookId, 'comments')
    );

    querySnapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
    });
    console.log();
  }

  async addNewComment(
    bookId: string,
    email: string,
    comment: string,
    rating: number
  ) {
    const docRef = await addDoc(
      collection(this._firestore, 'books', bookId, 'comments'),
      {
        email,
        comment,
        rating,
      }
    );

    console.log('document written with id:', docRef.id);
  }
}
