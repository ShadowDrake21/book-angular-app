import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  http = inject(HttpClient);

  private BASE_API_URL: string =
    'https://www.googleapis.com/books/v1/volumes?q=';

  getBooks(search: string) {
    return this.http.get<any>(this.BASE_API_URL + search);
  }
}
