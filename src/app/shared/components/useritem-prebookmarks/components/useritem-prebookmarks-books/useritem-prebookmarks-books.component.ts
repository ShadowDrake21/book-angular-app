import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { UseritemBookmarksComponent } from '../../../useritem-bookmarks/useritem-bookmarks.component';
import { BooksService } from '../../../../../core/services/books.service';
import { BookmarkService } from '../../../../../core/services/bookmark.service';
import { IWork } from '../../../../models/book.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-useritem-prebookmarks-books',
  standalone: true,
  imports: [CommonModule, UseritemBookmarksComponent],
  templateUrl: './useritem-prebookmarks-books.component.html',
  styleUrl: './useritem-prebookmarks-books.component.scss',
})
export class UseritemPrebookmarksBooksComponent implements OnInit {
  private booksService = inject(BooksService);
  private bookmarkService = inject(BookmarkService);

  @Input({ required: true }) email: string | null | undefined = '';
  @Output() countBooks = new EventEmitter<number>();

  loadingBookBookmarks!: boolean;
  userBookBookmarks: string[] = [];

  loadingBooks!: boolean;
  userBooks: IWork[] = [];

  isAnyBook: boolean = true;

  async ngOnInit(): Promise<void> {
    this.loadingBookBookmarks = true;
    this.loadingBooks = true;
    this.userBookBookmarks = (await this.bookmarkService.getAllBookmarks(
      'books',
      this.email
    )) as string[];

    this.loadingBookBookmarks = false;

    this.countBooks.emit(this.userBookBookmarks.length);

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
      this.loadingBooks = false;
    });
  }
}
