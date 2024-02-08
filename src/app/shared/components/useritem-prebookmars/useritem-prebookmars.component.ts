import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { forkJoin } from 'rxjs';
import { IWork } from '../../models/book.model';
import { IAuthor } from '../../models/author.model';
import { BooksService } from '../../../core/services/books.service';
import { AuthorsService } from '../../../core/services/authors.service';
import { BookmarkService } from '../../../core/services/bookmark.service';
import { CommonModule } from '@angular/common';
import { UseritemBookmarksComponent } from '../useritem-bookmarks/useritem-bookmarks.component';

@Component({
  selector: 'app-useritem-prebookmars',
  standalone: true,
  imports: [CommonModule, UseritemBookmarksComponent],
  templateUrl: './useritem-prebookmars.component.html',
  styleUrl: './useritem-prebookmars.component.scss',
})
export class UseritemPrebookmarsComponent implements OnInit {
  booksService = inject(BooksService);
  authorsService = inject(AuthorsService);
  bookmarkService = inject(BookmarkService);

  @Input({ required: true }) userEmail: string | null | undefined = '';
  @Output() countBooks = new EventEmitter<number>();
  @Output() countAuthors = new EventEmitter<number>();

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

  async ngOnInit(): Promise<void> {
    this.loadingBookBookmarks = true;
    this.loadingAuthorBookmarks = true;
    this.loadingBooks = true;
    this.loadingAuthors = true;
    this.userBookBookmarks = (await this.getAllBookmarks('books')) as string[];
    this.loadingBookBookmarks = false;

    if (this.userBookBookmarks.length) {
      this.isAnyBook = true;
    } else {
      this.isAnyBook = false;
    }

    this.countBooks.emit(this.userBookBookmarks.length);

    this.userAuthorBookmarks = (await this.getAllBookmarks(
      'authors'
    )) as string[];

    this.loadingAuthorBookmarks = false;

    if (this.userAuthorBookmarks.length) {
      this.isAnyAuthor = true;
    } else {
      this.isAnyAuthor = false;
    }

    this.countAuthors.emit(this.userAuthorBookmarks.length);

    const booksObservables = this.userBookBookmarks.map((bookKey: string) => {
      return this.booksService.getWorkByKey(bookKey);
    });

    forkJoin(booksObservables).subscribe((books: IWork[]) => {
      this.userBooks = books;
      this.loadingBooks = false;
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
    });
  }

  async getAllBookmarks(entity: string): Promise<string[] | undefined> {
    try {
      if (!this.userEmail) return;
      const res = await this.bookmarkService.getAllBookmarksInUserData(
        this.userEmail,
        entity
      );

      return res;
    } catch (error) {
      throw error;
    }
  }
}
