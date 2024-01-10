import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SEARCH_API_URL } from '../constants/books.constants';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  http = inject(HttpClient);

  getBooksByTitles(searchStr: string) {
    return this.http.get<any>(
      SEARCH_API_URL + '?title=' + searchStr + '&limit=10'
    );
  }
}
