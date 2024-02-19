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
import { IQuote } from '../../shared/models/quote.model';

@Injectable({
  providedIn: 'root',
})
export class QuotesService {
  private _firestore = inject(Firestore);

  async getAllQuotes(email: string): Promise<IQuote[]> {
    let quotes: Array<IQuote> = [];
    const querySnapshot = await getDocs(
      query(
        collection(this._firestore, 'usersData', email, 'quotes'),
        orderBy('author', 'asc')
      )
    );

    querySnapshot.forEach((doc) => {
      const quoteFromDB = doc.data() as IQuote;
      quotes.push(quoteFromDB);
    });
    return quotes;
  }

  async addNewQuote(email: string, quote: IQuote) {
    await setDoc(
      doc(this._firestore, 'usersData', email, 'quotes', quote.id),
      quote
    );
  }

  async deleteQuote(email: string, quoteId: string) {
    await deleteDoc(doc(this._firestore, 'userData', email, 'quotes', quoteId));
  }

  async updateQuote(email: string, quoteId: string, dataObj: IQuote) {
    const docRef = doc(this._firestore, 'usersData', email, 'quotes', quoteId);
    let updateObj: object = {
      id: dataObj.id,
      text: dataObj.text,
      author: dataObj.author,
    };
    await updateDoc(docRef, updateObj);
  }
}
