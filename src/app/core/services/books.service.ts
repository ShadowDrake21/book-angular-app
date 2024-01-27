import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  AUTHORS_API_URL,
  AUTHOR_API_URL,
  SEARCH_API_URL,
  SUBJECT_API_URL,
  WORK_URL,
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

  getBooksByTitles(title: string, ...[params]: any) {
    return this.http.get<any>(SEARCH_API_URL, {
      params: { title: title, ...params },
    });
  }

  getBooksByAuthor(author: string, ...[params]: any) {
    return this.http.get<any>(SEARCH_API_URL, {
      params: { author: author, ...params },
    });
  }

  getBooksBySubject(subject: string, ...[params]: any) {
    return this.http.get<any>(SUBJECT_API_URL + subject + '.json', {
      params: params,
    });
  }

  getWorkByKey(key: string) {
    return this.http.get<any>(WORK_URL + key + '.json');
  }
}
