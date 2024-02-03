import { Timestamp } from '@angular/fire/firestore';

export interface ISentFriendRequestToDB {
  recipientEmail: string;
  date: Timestamp;
}

export interface ISentFriendRequestToClient {
  recipientEmail: string;
  date: Date;
}

export interface IGottenFriendRequestToDB {
  senderEmail: string;
  date: Timestamp;
}

export interface IGottenFriendRequestToClient {
  senderEmail: string;
  date: Date;
}
