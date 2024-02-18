import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { IChallenge } from '../../shared/models/challenge.model';

@Injectable({
  providedIn: 'root',
})
export class ChallengesService {
  private _firestore = inject(Firestore);

  async addNewChallenge(email: string, entity: string, challenge: IChallenge) {
    await setDoc(
      doc(this._firestore, 'usersData', email, entity, challenge.id),
      challenge
    );
  }

  async deleteChallenge(email: string, entity: string, challengeId: string) {
    await deleteDoc(
      doc(this._firestore, 'usersData', email, entity, challengeId)
    );
  }

  async updateChallenge(
    email: string,
    challengeId: string,
    dataObj: IChallenge
  ) {
    const docRef = doc(
      this._firestore,
      'usersData',
      email,
      'activeChallenges',
      challengeId
    );
    let updateObj: object = {
      id: dataObj.id,
      title: dataObj.title,
      total: dataObj.total,
      read: dataObj.read,
      image: dataObj.image,
    };
    await updateDoc(docRef, updateObj);
  }

  async getAllChallenges(email: string, entity: string): Promise<IChallenge[]> {
    let challenges: Array<IChallenge> = [];
    const querySnapshot = await getDocs(
      query(
        collection(this._firestore, 'usersData', email, entity),
        orderBy('title', 'asc')
      )
    );

    querySnapshot.forEach((doc) => {
      const challengeFromDB = doc.data() as IChallenge;
      challenges.push(challengeFromDB);
    });
    return challenges;
  }
}
