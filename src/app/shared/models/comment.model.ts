import { Timestamp } from '@angular/fire/firestore';

export interface IBookCommentToDB {
  email: string;
  comment: string;
  rating: number;
  date: Timestamp;
  photoURL: string;
}

export interface IBookCommentToClient {
  email: string;
  comment: string;
  rating: number;
  date: Date;
  photoURL: string;
}

export interface INeededUserInfo {
  email: string;
  photoURL: string;
}
