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
import { IBookComment } from '../../shared/models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private _firestore = inject(Firestore);

  async getAllCommentsByBook(bookId: string): Promise<IBookComment[]> {
    let comments: Array<IBookComment> = [];
    const querySnapshot = await getDocs(
      collection(this._firestore, 'books', bookId, 'comments')
    );

    querySnapshot.forEach((doc) => {
      comments.push(doc.data() as IBookComment);
    });
    return comments;
  }

  async addNewComment(bookId: string, dataObj: IBookComment) {
    const docRef = await addDoc(
      collection(this._firestore, 'books', bookId, 'comments'),
      dataObj
    );

    console.log('document written with id:', docRef.id);
  }
}
