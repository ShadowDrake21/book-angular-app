import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { BooksService } from '../../core/services/books.service';
import { AuthorsService } from '../../core/services/authors.service';
import { AuthService } from '../../core/authentication/auth.service';
import { IWork } from '../../shared/models/book.model';
import { IAuthor } from '../../shared/models/author.model';
import { BookmarkService } from '../../core/services/bookmark.service';
import { forkJoin } from 'rxjs';
import { UseritemBookmarksComponent } from '../../shared/components/useritem-bookmarks/useritem-bookmarks.component';
import { TruncateTextPipe } from '../../shared/pipes/truncate-text.pipe';

@Component({
  selector: 'app-favbooks',
  standalone: true,
  imports: [CommonModule, UseritemBookmarksComponent, TruncateTextPipe],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent implements OnInit {
  authService = inject(AuthService);
  bookmarkService = inject(BookmarkService);
  booksService = inject(BooksService);
  authorsService = inject(AuthorsService);

  loadingUserEmail!: boolean;
  userEmail!: string | null | undefined;
  loadingBookBookmarks!: boolean;
  userBookBookmarks: string[] = [];

  loadingBooks!: boolean;
  userBooks: IWork[] = [];

  isAnyBook: boolean = true;

  loadingAuthorBookmarks!: boolean;
  userAuthorBookmarks: string[] = [];

  loadingAuthors!: boolean;
  userAuthors: IAuthor[] = [];

  isAnyAuthor: boolean = true;
  ngOnInit(): void {
    this.loadingUserEmail = true;
    this.loadingBookBookmarks = true;
    this.loadingAuthorBookmarks = true;
    this.loadingBooks = true;
    this.loadingAuthors = true;
    this.authService.user$.subscribe(async (data) => {
      this.userEmail = data?.email;
      this.loadingUserEmail = false;
      if (this.userEmail) {
        this.userBookBookmarks =
          (await this.bookmarkService.getAllBookmarksInUserData(
            this.userEmail,
            'books'
          )) as string[];
        this.loadingBookBookmarks = false;

        if (this.userBookBookmarks.length) {
          this.isAnyBook = true;
        } else {
          this.isAnyBook = false;
        }

        this.userAuthorBookmarks =
          (await this.bookmarkService.getAllBookmarksInUserData(
            this.userEmail,
            'authors'
          )) as string[];
        this.loadingAuthorBookmarks = false;

        if (this.userAuthorBookmarks.length) {
          this.isAnyAuthor = true;
        } else {
          this.isAnyAuthor = false;
        }

        const booksObservables = this.userBookBookmarks.map(
          (bookKey: string) => {
            return this.booksService.getWorkByKey(bookKey);
          }
        );

        forkJoin(booksObservables).subscribe((books: IWork[]) => {
          this.userBooks = books;
          this.loadingBooks = false;
          console.log(this.userBooks);
        });

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
          this.loadingAuthors = false;
          console.log(this.userAuthors);
        });
      }
    });
  }
}
