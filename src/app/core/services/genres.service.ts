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
  where,
} from '@angular/fire/firestore';
import { IQuote } from '../../shared/models/quote.model';
import { IGenre } from '../../shared/models/genre.model';

@Injectable({
  providedIn: 'root',
})
export class GenresService {
  private _firestore = inject(Firestore);

  async getAllGenres(email: string): Promise<IGenre[]> {
    let genres: Array<IGenre> = [];
    const querySnapshot = await getDocs(
      query(
        collection(this._firestore, 'usersData', email, 'genres'),
        orderBy('name', 'asc')
      )
    );

    querySnapshot.forEach((doc) => {
      const genreFromDB = doc.data() as IGenre;
      genres.push(genreFromDB);
    });
    return genres;
  }

  async getGenre(
    email: string,
    searchField: string,
    searchValue: string
  ): Promise<IGenre[]> {
    let genres: Array<IGenre> = [];
    const querySnapshot = await getDocs(
      query(
        collection(this._firestore, 'usersData', email, 'genres'),
        where(searchField, '==', searchValue)
      )
    );

    querySnapshot.forEach((doc) => {
      const genreFromDB = doc.data() as IGenre;
      genres.push(genreFromDB);
    });
    return genres;
  }

  async addGenresGroup(email: string, genres: IGenre[]) {
    for (const genre of genres) {
      if (genre.id) await this.addNewGenre(email, genre.id, genre);
    }
  }

  async addNewGenre(email: string, genreId: string, genre: IGenre) {
    await setDoc(
      doc(this._firestore, 'usersData', email, 'genres', genreId),
      genre
    );
  }

  async deleteGenresGroup(email: string, genresIds: string[]) {
    console.log(genresIds);
    for (const genreId of genresIds) {
      await this.deleteGenre(email, genreId);
    }
  }

  async deleteGenre(email: string, genreId: string) {
    console.log('delete', genreId);
    await deleteDoc(
      doc(this._firestore, 'usersData', email, 'genres', genreId)
    );
  }

  async updateGenre(email: string, genreId: string, dataObj: IGenre) {
    const docRef = doc(this._firestore, 'usersData', email, 'genres', genreId);
    let updateObj: object = {
      id: dataObj.id,
      name: dataObj.name,
    };
    if (dataObj.type) updateObj = { ...updateObj, type: dataObj.type };
    await updateDoc(docRef, updateObj);
  }
}
