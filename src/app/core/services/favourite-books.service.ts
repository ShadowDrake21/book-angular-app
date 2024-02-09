import { Injectable, inject } from '@angular/core';
import { BooksService } from './books.service';
import { BookmarkService } from './bookmark.service';
import { IWork } from '../../shared/models/book.model';
import { forkJoin } from 'rxjs';

@Injectable()
export class FavouriteBooksService {
  private booksService = inject(BooksService);
  private bookmarkService = inject(BookmarkService);

  userEmail: string | null | undefined = '';
  loadingBookBookmarks!: boolean;
  userBookBookmarks: string[] = [];

  loadingBooks!: boolean;
  userBooks: IWork[] = [];

  isAnyBook: boolean = true;

  async loadingItems() {
    this.loadingBookBookmarks = true;
    this.loadingBooks = true;
    this.userBookBookmarks = (await this.bookmarkService.getAllBookmarks(
      'books',
      this.userEmail
    )) as string[];

    this.loadingBookBookmarks = false;

    if (this.userBookBookmarks.length) {
      this.isAnyBook = true;
    } else {
      this.isAnyBook = false;
    }

    const booksObservables = this.userBookBookmarks.map((bookKey: string) => {
      return this.booksService.getWorkByKey(bookKey);
    });

    forkJoin(booksObservables).subscribe((books: IWork[]) => {
      this.userBooks = books;
    });
  }
}
