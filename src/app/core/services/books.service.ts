import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  AUTHORS_API_URL,
  SEARCH_API_URL,
  SUBJECT_API_URL,
} from '../constants/books.constants';

export interface BooksBySubject {
  details?: boolean;
  limit?: number;
  sort?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  http = inject(HttpClient);

  getBooksByTitles(title: string, limit: number) {
    return this.http.get<any>(SEARCH_API_URL, {
      params: { title: title, limit: limit },
    });
  }

  getBooksByAuthor(author: string, limit: number) {
    return this.http.get<any>(SEARCH_API_URL, {
      params: { author: author, limit: limit },
    });
  }

  getBooksBySubject(subject: string, ...[params]: any) {
    console.log(params);
    return this.http.get<any>(SUBJECT_API_URL + subject + '.json', {
      params: params,
    });
  }

  getAuthorsByName(name: string, offest: number, limit: number) {
    return this.http.get<any>(AUTHORS_API_URL, {
      params: { q: name, offset: offest, limit: limit },
    });
  }
}
