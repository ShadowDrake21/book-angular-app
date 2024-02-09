import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { BooksService } from '../../../../core/services/books.service';
import { User } from '@angular/fire/auth';
import { IWork } from '../../../../shared/models/book.model';
import { BookmarkService } from '../../../../core/services/bookmark.service';
import { forkJoin } from 'rxjs';
import { WorkItemComponent } from '../../../../shared/components/work-item/work-item.component';

@Component({
  selector: 'app-profile-books',
  standalone: true,
  imports: [CommonModule, WorkItemComponent],
  templateUrl: './profile-books.component.html',
  styleUrl: './profile-books.component.scss',
})
export class ProfileBooksComponent implements OnInit, OnChanges {
  private booksService = inject(BooksService);
  private bookmarkService = inject(BookmarkService);

  @Input() user!: User | null;

  loadingBookBookmarks!: boolean;
  userBookBookmarks: string[] = [];

  loadingBooks!: boolean;
  userBooks: IWork[] = [];

  isAnyBook: boolean = true;

  ngOnInit(): void {
    this.loadingBookBookmarks = true;
    this.loadingBooks = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      this.user = changes['user'].currentValue;
      if (this.user) {
        this.loadingItems();
      }
    }
  }

  async loadingItems() {
    await this.bookmarkService
      .getAllBookmarks('books', this.user?.email)
      .then((bookmarks) => {
        if (!bookmarks) return;
        this.userBookBookmarks = bookmarks;
      });
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
      this.userBooks = books.slice(0, 5);
      this.loadingBooks = false;
    });
  }
}
