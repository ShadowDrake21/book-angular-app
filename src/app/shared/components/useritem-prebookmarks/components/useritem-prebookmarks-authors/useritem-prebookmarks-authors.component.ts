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
import { AuthorsService } from '../../../../../core/services/authors.service';
import { BookmarkService } from '../../../../../core/services/bookmark.service';
import { IAuthor } from '../../../../models/author.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-useritem-prebookmarks-authors',
  standalone: true,
  imports: [CommonModule, UseritemBookmarksComponent],
  templateUrl: './useritem-prebookmarks-authors.component.html',
  styleUrl: './useritem-prebookmarks-authors.component.scss',
})
export class UseritemPrebookmarksAuthorsComponent implements OnInit {
  private authorsService = inject(AuthorsService);
  private bookmarkService = inject(BookmarkService);

  @Input({ required: true }) email: string | null | undefined = '';
  @Output() countAuthors = new EventEmitter<number>();

  loadingAuthorBookmarks!: boolean;
  userAuthorBookmarks: string[] = [];

  loadingAuthors!: boolean;
  userAuthors: IAuthor[] = [];

  isAnyAuthor: boolean = true;

  async ngOnInit(): Promise<void> {
    this.loadingAuthorBookmarks = true;
    this.loadingAuthors = true;

    this.userAuthorBookmarks = (await this.bookmarkService.getAllBookmarks(
      'authors',
      this.email
    )) as string[];

    this.loadingAuthorBookmarks = false;

    this.countAuthors.emit(this.userAuthorBookmarks.length);

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
      this.loadingAuthors = false;
    });
  }
}
