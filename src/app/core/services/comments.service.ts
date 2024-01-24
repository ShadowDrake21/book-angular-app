import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  Timestamp,
  addDoc,
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from '@angular/fire/firestore';
import {
  IBookCommentToClient,
  IBookCommentToDB,
} from '../../shared/models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private _firestore = inject(Firestore);

  async getAllCommentsByBook(bookId: string): Promise<IBookCommentToClient[]> {
    let comments: Array<IBookCommentToClient> = [];
    const querySnapshot = await getDocs(
      query(
        collection(this._firestore, 'books', bookId, 'comments'),
        orderBy('date', 'desc')
      )
    );

    querySnapshot.forEach((doc) => {
      const commentDataFromDB = doc.data() as IBookCommentToDB;

      let transformDate: Date = (commentDataFromDB.date as Timestamp).toDate();
      const commentDateToClient: IBookCommentToClient = {
        email: commentDataFromDB.email,
        comment: commentDataFromDB.comment,
        rating: commentDataFromDB.rating,
        date: transformDate,
        photoURL: commentDataFromDB.photoURL,
      };
      comments.push(commentDateToClient);
    });
    return comments;
  }

  async addNewComment(bookId: string, dataObj: IBookCommentToDB) {
    const docRef = await addDoc(
      collection(this._firestore, 'books', bookId, 'comments'),
      dataObj
    );

    console.log('document written with id:', docRef.id);
  }
}
