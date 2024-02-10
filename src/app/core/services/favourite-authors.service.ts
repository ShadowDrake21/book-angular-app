import { Injectable, inject } from '@angular/core';
import { AuthorsService } from './authors.service';
import { BookmarkService } from './bookmark.service';
import { IAuthor } from '../../shared/models/author.model';
import { forkJoin } from 'rxjs';

@Injectable()
export class FavouriteAuthorsService {
  private authorsService = inject(AuthorsService);
  private bookmarkService = inject(BookmarkService);

  userEmail: string | null | undefined = '';

  loadingAuthorBookmarks!: boolean;
  userAuthorBookmarks: string[] = [];

  loadingAuthors!: boolean;
  userAuthors: IAuthor[] = [];

  isAnyAuthor: boolean = true;

  async loadingItems() {
    this.loadingAuthorBookmarks = true;
    this.loadingAuthors = true;

    this.userAuthorBookmarks = (await this.bookmarkService.getAllBookmarks(
      'authors',
      this.userEmail
    )) as string[];

    this.loadingAuthorBookmarks = false;

    if (this.userAuthorBookmarks.length) {
      this.isAnyAuthor = true;
    } else {
      this.isAnyAuthor = false;
    }

    const authorsObservables = this.userAuthorBookmarks.map(
      (authorKey: string) => {
        return this.authorsService.getAuthorByKey(authorKey);
      }
    );

    forkJoin(authorsObservables).subscribe((authors: IAuthor[]) => {
      authors.forEach((author: IAuthor) => {
        author.key = author.key.slice(9, author.key.length);
        this.userAuthors.push(author);
      });
    });
  }
}
