import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import {
  IGottenFriendRequestToClient,
  IGottenFriendRequestToDB,
  ISentFriendRequestToClient,
  ISentFriendRequestToDB,
} from '../../shared/models/friendsManagement.model';

@Injectable({
  providedIn: 'root',
})
export class FriendsManagementService {
  private _firestore = inject(Firestore);

  async sendFriendRequest(
    entity: string,
    senderEmail: string,
    recipientEmail: string,
    dataObj: ISentFriendRequestToDB | IGottenFriendRequestToDB
  ) {
    await setDoc(
      doc(
        this._firestore,
        'friendsManagement',
        senderEmail,
        entity,
        recipientEmail
      ),
      dataObj
    );
  }

  async checkUserSentOrGotFriendRequest(
    entity: string,
    emailA: string,
    emailB: string,
    queryParam: string
  ): Promise<boolean> {
    const querySnapshot = await getDocs(
      query(
        collection(this._firestore, 'friendsManagement', emailA, entity),
        where(queryParam, '==', emailB)
      )
    );

    return !querySnapshot.empty;
  }

  async getFriendRequest(
    action: 'send' | 'get',
    emailA: string,
    emailB: string
  ) {
    let friendRequests: Array<
      ISentFriendRequestToClient | IGottenFriendRequestToClient
    > = [];
    let querySnapshot;
    if (action === 'send') {
      querySnapshot = await getDocs(
        query(
          collection(
            this._firestore,
            'friendsManagement',
            emailA,
            'sentRequests'
          ),
          where('recipientEmail', '==', emailB)
        )
      );
    } else {
      querySnapshot = await getDocs(
        query(
          collection(
            this._firestore,
            'friendsManagement',
            emailA,
            'gottenRequests'
          ),
          where('senderEmail', '==', emailB)
        )
      );
    }

    querySnapshot.forEach((doc) => {
      let requestDataFromDB;
      if (action === 'send') {
        requestDataFromDB = doc.data() as ISentFriendRequestToDB;

        let transformDate: Date = (
          requestDataFromDB.date as Timestamp
        ).toDate();
        const requestDataToClient: ISentFriendRequestToClient = {
          recipientEmail: requestDataFromDB.recipientEmail,
          date: transformDate,
        };
        friendRequests.push(requestDataToClient);
      } else {
        requestDataFromDB = doc.data() as IGottenFriendRequestToDB;

        let transformDate: Date = (
          requestDataFromDB.date as Timestamp
        ).toDate();
        const requestDataToClient: IGottenFriendRequestToClient = {
          senderEmail: requestDataFromDB.senderEmail,
          date: transformDate,
        };
        friendRequests.push(requestDataToClient);
      }
    });
    return friendRequests;
  }

  async deleteSentFriendRequest(senderEmail: string, recipientEmail: string) {
    await deleteDoc(
      doc(
        this._firestore,
        'friendsManagement',
        senderEmail,
        'sentRequests',
        recipientEmail
      )
    );
  }

  async deleteGottenFriendRequest(senderEmail: string, recipientEmail: string) {
    await deleteDoc(
      doc(
        this._firestore,
        'friendsManagement',
        recipientEmail,
        'gottenRequests',
        senderEmail
      )
    );
  }
}
