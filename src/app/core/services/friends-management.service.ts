import { Injectable, inject } from '@angular/core';
import {
  DocumentData,
  Firestore,
  QueryDocumentSnapshot,
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
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

  async checkUserFriendRequest(
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
      let requestDataToClient;
      if (action === 'send') {
        requestDataToClient = this.formSentGottenRequest(doc);
        friendRequests.push(requestDataToClient);
        console.log('send requests:', requestDataToClient);
      } else {
        requestDataToClient = this.formReceivedGottenRequest(doc);
        friendRequests.push(requestDataToClient);
        console.log('gotten requests:', requestDataToClient);
      }
    });
    return friendRequests;
  }

  formSentGottenRequest(
    doc: QueryDocumentSnapshot<DocumentData, DocumentData>
  ): ISentFriendRequestToClient {
    let requestDataFromDB = doc.data() as ISentFriendRequestToDB;

    let transformDate: Date = (requestDataFromDB.date as Timestamp).toDate();
    const requestDataToClient: ISentFriendRequestToClient = {
      recipientEmail: requestDataFromDB.recipientEmail,
      date: transformDate,
    };

    return requestDataToClient;
  }

  formReceivedGottenRequest(
    doc: QueryDocumentSnapshot<DocumentData, DocumentData>
  ): IGottenFriendRequestToClient {
    let requestDataFromDB = doc.data() as IGottenFriendRequestToDB;

    let transformDate: Date = (requestDataFromDB.date as Timestamp).toDate();
    const requestDataToClient: IGottenFriendRequestToClient = {
      senderEmail: requestDataFromDB.senderEmail,
      date: transformDate,
    };

    return requestDataToClient;
  }

  async deleteSentFriendRequest(
    senderEmail: string,
    recipientEmail: string,
    entity: 'sentRequests' | 'accepted' | 'rejected'
  ) {
    await deleteDoc(
      doc(
        this._firestore,
        'friendsManagement',
        senderEmail,
        entity,
        recipientEmail
      )
    );
  }

  async deleteGottenFriendRequest(
    senderEmail: string,
    recipientEmail: string,
    entity: 'gottenRequests' | 'accepted' | 'rejected'
  ) {
    await deleteDoc(
      doc(
        this._firestore,
        'friendsManagement',
        recipientEmail,
        entity,
        senderEmail
      )
    );
  }

  async getAllGottenFriendRequests(
    email: string,
    entity: 'gottenRequests' | 'accepted' | 'rejected'
  ): Promise<IGottenFriendRequestToClient[]> {
    let friendRequests: Array<IGottenFriendRequestToClient> = [];
    const querySnapshot = await getDocs(
      query(
        collection(this._firestore, 'friendsManagement', email, entity),
        orderBy('date', 'asc')
      )
    );
    querySnapshot.forEach((doc) => {
      const requestDataFromDB = doc.data() as IGottenFriendRequestToDB;

      let transformDate: Date = (requestDataFromDB.date as Timestamp).toDate();
      const requestDataToClient: IGottenFriendRequestToClient = {
        senderEmail: requestDataFromDB.senderEmail,
        date: transformDate,
      };
      friendRequests.push(requestDataToClient);
    });
    return friendRequests;
  }

  async getAllSentFriendRequests(
    email: string
  ): Promise<ISentFriendRequestToClient[]> {
    let friendRequests: Array<ISentFriendRequestToClient> = [];
    const querySnapshot = await getDocs(
      collection(this._firestore, 'friendsManagement', email, 'sentRequests')
    );
    querySnapshot.forEach((doc) => {
      const requestDataFromDB = doc.data() as ISentFriendRequestToDB;
      let transformDate: Date = (requestDataFromDB.date as Timestamp).toDate();
      const requestDataToClient: ISentFriendRequestToClient = {
        recipientEmail: requestDataFromDB.recipientEmail,
        date: transformDate,
      };
      friendRequests.push(requestDataToClient);
    });
    return friendRequests;
  }

  async manipulateFriendRequest(
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

  // async prepareUserFriendRequestCollectionToRemove(email: string) {
  //   const allGottenFriendRequests: IGottenFriendRequestToClient[] =
  //     await this.getAllGottenFriendRequests(email, 'gottenRequests');
  //   let allGottenFriendRequestsEmails: string[] = [];
  //   const allAcceptedFriendRequests: IGottenFriendRequestToClient[] =
  //     await this.getAllGottenFriendRequests(email, 'accepted');
  //   let allAcceptedFriendRequestsEmails: string[] = [];
  //   const allRejectedFriendRequests: IGottenFriendRequestToClient[] =
  //     await this.getAllGottenFriendRequests(email, 'rejected');
  //   let allRejectedFriendRequestsEmails: string[] = [];

  //   allGottenFriendRequests.map((request) => {
  //     allGottenFriendRequestsEmails.push(request.senderEmail);
  //   });
  //   allAcceptedFriendRequests.map((request) => {
  //     allAcceptedFriendRequestsEmails.push(request.senderEmail);
  //   });
  //   allRejectedFriendRequests.map((request) => {
  //     allRejectedFriendRequestsEmails.push(request.senderEmail);
  //   });

  //   allGottenFriendRequestsEmails.map((senderEmail: string) => {
  //     this.deleteGottenFriendRequest(senderEmail, email, 'gottenRequests');
  //   });
  //   allAcceptedFriendRequestsEmails.map((senderEmail: string) => {
  //     this.deleteGottenFriendRequest(senderEmail, email, 'accepted');
  //   });
  //   allRejectedFriendRequestsEmails.map((senderEmail: string) => {
  //     this.deleteGottenFriendRequest(senderEmail, email, 'rejected');
  //   });

  //   allGottenFriendRequestsEmails.map((senderEmail: string) => {
  //     this.deleteSentFriendRequest(senderEmail, email, 'sentRequests');
  //   });
  //   allAcceptedFriendRequestsEmails.map((senderEmail: string) => {
  //     this.deleteSentFriendRequest(senderEmail, email, 'accepted');
  //   });
  //   allRejectedFriendRequestsEmails.map((senderEmail: string) => {
  //     this.deleteSentFriendRequest(senderEmail, email, 'rejected');
  //   });

  //   const allSendFriendRequests: ISentFriendRequestToClient[] =
  //     await this.getAllSentFriendRequests(email);
  //   let allSendFriendRequestsEmails: string[] = [];

  //   allSendFriendRequests.map((request) => {
  //     allSendFriendRequestsEmails.push(request.recipientEmail);
  //   });
  //   allSendFriendRequestsEmails.map((recipientEmail: string) => {
  //     this.deleteSentFriendRequest(email, recipientEmail, 'sentRequests');
  //     this.deleteGottenFriendRequest(email, recipientEmail, 'gottenRequests');
  //     this.deleteGottenFriendRequest(email, recipientEmail, 'accepted');
  //     this.deleteGottenFriendRequest(email, recipientEmail, 'rejected');
  //   });
  // }

  async prepareUserFriendRequestCollectionToRemove(email: string) {
    const allGottenFriendRequests = await this.getAllGottenFriendRequests(
      email,
      'gottenRequests'
    );
    const allAcceptedFriendRequests = await this.getAllGottenFriendRequests(
      email,
      'accepted'
    );
    const allRejectedFriendRequests = await this.getAllGottenFriendRequests(
      email,
      'rejected'
    );
    const allSendFriendRequests = await this.getAllSentFriendRequests(email);

    const allGottenFriendRequestsEmails = allGottenFriendRequests.map(
      (request) => request.senderEmail
    );
    const allAcceptedFriendRequestsEmails = allAcceptedFriendRequests.map(
      (request) => request.senderEmail
    );
    const allRejectedFriendRequestsEmails = allRejectedFriendRequests.map(
      (request) => request.senderEmail
    );
    const allSendFriendRequestsEmails = allSendFriendRequests.map(
      (request) => request.recipientEmail
    );

    await Promise.all([
      ...allGottenFriendRequestsEmails.map((senderEmail) =>
        this.deleteGottenFriendRequest(senderEmail, email, 'gottenRequests')
      ),
      ...allAcceptedFriendRequestsEmails.map((senderEmail) =>
        this.deleteGottenFriendRequest(senderEmail, email, 'accepted')
      ),
      ...allRejectedFriendRequestsEmails.map((senderEmail) =>
        this.deleteGottenFriendRequest(senderEmail, email, 'rejected')
      ),
      ...allGottenFriendRequestsEmails.map((senderEmail) =>
        this.deleteSentFriendRequest(senderEmail, email, 'sentRequests')
      ),
      ...allAcceptedFriendRequestsEmails.map((senderEmail) =>
        this.deleteSentFriendRequest(senderEmail, email, 'accepted')
      ),
      ...allRejectedFriendRequestsEmails.map((senderEmail) =>
        this.deleteSentFriendRequest(senderEmail, email, 'rejected')
      ),
      ...allSendFriendRequestsEmails.map((recipientEmail) => {
        this.deleteSentFriendRequest(email, recipientEmail, 'sentRequests');
        this.deleteGottenFriendRequest(email, recipientEmail, 'gottenRequests');
        this.deleteGottenFriendRequest(email, recipientEmail, 'accepted');
        this.deleteGottenFriendRequest(email, recipientEmail, 'rejected');
      }),
    ]);
  }

  async deleteUserFriendRequestCollection(email: string) {
    await deleteDoc(doc(this._firestore, 'friendsManagement', email)).then(
      () => {
        console.log('deleteUserFriendRequestCollection successfull');
      }
    );
  }
}
