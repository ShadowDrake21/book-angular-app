import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  Timestamp,
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
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
        id: commentDataFromDB.id,
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

  async addNewComment(
    bookId: string,
    commentId: string,
    dataObj: IBookCommentToDB
  ) {
    await setDoc(
      doc(this._firestore, 'books', bookId, 'comments', commentId),
      dataObj
    );
  }

  async updateComment(
    bookId: string,
    commentId: string,
    dataObj: IBookCommentToDB
  ) {
    const docRef = doc(this._firestore, 'books', bookId, 'comments', commentId);

    await updateDoc(docRef, {
      comment: dataObj.comment,
      rating: dataObj.rating,
      date: dataObj.date,
    });

    console.log('document updated with id:', docRef.id);
  }

  async getComment(
    bookId: string,
    commentId: string
  ): Promise<IBookCommentToClient[]> {
    let comments: Array<IBookCommentToClient> = [];
    const querySnapshot = await getDocs(
      query(
        collection(this._firestore, 'books', bookId, 'comments'),
        where('id', '==', commentId)
      )
    );

    querySnapshot.forEach((doc) => {
      const commentDataFromDB = doc.data() as IBookCommentToDB;

      let transformDate: Date = (commentDataFromDB.date as Timestamp).toDate();
      const commentDateToClient: IBookCommentToClient = {
        id: commentDataFromDB.id,
        email: commentDataFromDB.email,
        comment: commentDataFromDB.comment,
        rating: commentDataFromDB.rating,
        date: transformDate,
        photoURL: commentDataFromDB.photoURL,
      };
      comments.push(commentDateToClient);
    });
    console.log('edit comment: ', comments);
    return comments;
  }

  // zrobić coś takiego, ale na user obiekcie (spis komentarzy)
  async checkUserHasComment(
    bookId: string,
    userEmail: string
  ): Promise<boolean> {
    const querySnapshot = await getDocs(
      query(
        collection(this._firestore, 'books', bookId, 'comments'),
        where('email', '==', userEmail)
      )
    );
    return !querySnapshot.empty;
  }

  async deleteComment(bookId: string, commentId: string) {
    await deleteDoc(
      doc(this._firestore, 'books', bookId, 'comments', commentId)
    );
  }
}
