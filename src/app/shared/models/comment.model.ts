import { Timestamp } from '@angular/fire/firestore';

export interface IBookCommentToDB {
  id: string;
  email: string;
  comment: string;
  rating: number;
  date: Timestamp;
  photoURL: string;
}

export interface IBookCommentToClient {
  id: string;
  email: string;
  comment: string;
  rating: number;
  date: Date;
  photoURL: string;
}

export interface IAuthorCommentToDB {
  id: string;
  email: string;
  comment: string;
  booksNumber: number;
  date: Timestamp;
  photoURL: string;
}

export interface IAuthorCommentToClient {
  id: string;
  email: string;
  comment: string;
  booksNumber: number;
  date: Date;
  photoURL: string;
}

// export interface IUserCommentOnBook {
//   bookId: string;
//   comment: string;
//   rating: number;
//   date: Date;
// }

export interface ICommentResult {
  isSuccessfull: boolean;
  message: string;
}

export interface INeededUserInfo {
  email: string;
  photoURL: string;
}
