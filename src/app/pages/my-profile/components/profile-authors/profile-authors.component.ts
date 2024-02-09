import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { AuthorItemComponent } from '../../../../shared/components/author-item/author-item.component';
import { CommonModule } from '@angular/common';
import { AuthorsService } from '../../../../core/services/authors.service';
import { BookmarkService } from '../../../../core/services/bookmark.service';
import { User } from '@angular/fire/auth';
import { IAuthor } from '../../../../shared/models/author.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-profile-authors',
  standalone: true,
  imports: [CommonModule, AuthorItemComponent],
  templateUrl: './profile-authors.component.html',
  styleUrl: './profile-authors.component.scss',
})
export class ProfileAuthorsComponent implements OnInit, OnChanges {
  private authorsService = inject(AuthorsService);
  private bookmarkService = inject(BookmarkService);

  @Input({ required: true }) user!: User | null;

  loadingAuthorBookmarks!: boolean;
  userAuthorBookmarks: string[] = [];

  loadingAuthors!: boolean;
  userAuthors: IAuthor[] = [];

  isAnyAuthor: boolean = true;

  ngOnInit(): void {
    this.loadingAuthorBookmarks = true;
    this.loadingAuthors = true;
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
      .getAllBookmarks('authors', this.user?.email)
      .then((bookmarks) => {
        if (!bookmarks) return;
        this.userAuthorBookmarks = bookmarks;
      });
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
      this.userAuthors = this.userAuthors.slice(0, 5);
      this.loadingAuthors = false;
    });
  }
}
