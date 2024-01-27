import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AUTHORS_API_URL, AUTHOR_API_URL } from '../constants/books.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthorsService {
  http = inject(HttpClient);

  getAuthorsByName(name: string, offest: number, limit: number) {
    return this.http.get<any>(AUTHORS_API_URL, {
      params: { q: name, offset: offest, limit: limit },
    });
  }

  getAuthorByKey(key: string) {
    return this.http.get<any>(AUTHOR_API_URL + key + '.json');
  }
}
