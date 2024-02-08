import { Timestamp } from '@angular/fire/firestore';

export interface IBookCommentToDB {
  id: string;
  email: string;
  comment: string;
  rating: number;
  date: Timestamp;
}

export interface IBookCommentToClient {
  id: string;
  email: string;
  comment: string;
  rating: number;
  date: Date;
}

export interface IAuthorCommentToDB {
  id: string;
  email: string;
  comment: string;
  booksNumber: number;
  date: Timestamp;
}

export interface IAuthorCommentToClient {
  id: string;
  email: string;
  comment: string;
  booksNumber: number;
  date: Date;
}

export interface ICommentResult {
  isSuccessfull: boolean;
  message: string;
}

export interface INeededUserInfo {
  email: string;
}
