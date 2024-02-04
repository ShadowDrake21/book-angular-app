import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UsersService } from '../../core/services/users.service';
import { BooksService } from '../../core/services/books.service';
import { AuthorsService } from '../../core/services/authors.service';
import { IUser } from '../../shared/models/user.model';
import { TruncateTextPipe } from '../../shared/pipes/truncate-text.pipe';
import { CommentsService } from '../../core/services/comments.service';
import {
  IAuthorCommentToClient,
  IBookCommentToClient,
} from '../../shared/models/comment.model';
import { BookitemCommentComponent } from '../../shared/components/bookitem-comment/bookitem-comment.component';
import { AuthoritemCommentComponent } from '../../shared/components/authoritem-comment/authoritem-comment.component';
import { BookmarkService } from '../../core/services/bookmark.service';
import { CarouselComponent } from '../../shared/components/carousel/carousel.component';
import { IBook, IWork } from '../../shared/models/book.model';
import { IAuthor } from '../../shared/models/author.model';
import { UserlistItemBookmarksComponent } from './components/userlist-item-bookmarks/userlist-item-bookmarks.component';
import { forkJoin } from 'rxjs';
import { UserlistItemCommentsComponent } from './components/userlist-item-comments/userlist-item-comments.component';
import { UserlistItemFriendsManagementComponent } from './components/userlist-item-friends-management/userlist-item-friends-management.component';

interface IUserDetails {
  countBookComments: number;
  countAuthorComments: number;
  countBooks: number;
  countAuthors: number;
}
@Component({
  selector: 'app-userlist-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TruncateTextPipe,
    BookitemCommentComponent,
    AuthoritemCommentComponent,
    UserlistItemBookmarksComponent,
    UserlistItemCommentsComponent,
    UserlistItemFriendsManagementComponent,
  ],
  templateUrl: './userlist-item.component.html',
  styleUrl: './userlist-item.component.scss',
})
export class UserlistItemComponent implements OnInit {
  route = inject(ActivatedRoute);
  usersService = inject(UsersService);
  booksService = inject(BooksService);
  authorsService = inject(AuthorsService);
  commentsService = inject(CommentsService);
  bookmarkService = inject(BookmarkService);

  userId!: string;
  user!: IUser;
  isUserAvailable!: boolean;
  loadingUser!: boolean;

  loadingBookComments!: boolean;
  userBookComments: IBookCommentToClient[] = [];

  loadingAuthorComments!: boolean;
  userAuthorComments: IAuthorCommentToClient[] = [];

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

  recentBookComments: IBookCommentToClient[] = [];
  recentAuthorComments: IAuthorCommentToClient[] = [];

  details!: IUserDetails;

  ngOnInit(): void {
    this.userId = this.route.snapshot.url[1].path;
    this.loadingUser = true;
    this.loadingBookComments = true;
    this.loadingAuthorComments = true;
    this.loadingBookBookmarks = true;
    this.loadingAuthorBookmarks = true;
    this.loadingBooks = true;
    this.loadingAuthors = true;
    this.usersService
      .getUserById(this.userId)
      .then(async (res) => {
        this.user = res;
        this.isUserAvailable = true;
        this.loadingUser = false;

        this.userBookComments = (await this.getAllComments(
          'books'
        )) as IBookCommentToClient[];
        this.loadingBookComments = false;

        this.userAuthorComments = (await this.getAllComments(
          'authors'
        )) as IAuthorCommentToClient[];
        this.loadingAuthorComments = false;
        console.log(this.userAuthorComments);

        this.userBookBookmarks = (await this.getAllBookmarks(
          'books'
        )) as string[];
        this.loadingBookBookmarks = false;

        if (this.userBookBookmarks.length) {
          this.isAnyBook = true;
        } else {
          this.isAnyBook = false;
        }

        this.userAuthorBookmarks = (await this.getAllBookmarks(
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

        this.details = this.formDetails();
      })
      .catch((err) => {
        this.isUserAvailable = false;
      });
  }

  async getAllComments(
    entity: string
  ): Promise<(IBookCommentToClient | IAuthorCommentToClient)[] | undefined> {
    try {
      if (!this.user.email) return;
      const res = await this.commentsService.getAllCommentsInUserData(
        this.user.email,
        entity
      );
      return res;
    } catch (error) {
      throw error;
    }
  }

  async getAllBookmarks(entity: string): Promise<string[] | undefined> {
    try {
      if (!this.user.email) return;
      const res = await this.bookmarkService.getAllBookmarksInUserData(
        this.user.email,
        entity
      );

      return res;
    } catch (error) {
      throw error;
    }
  }

  formDetails(): IUserDetails {
    return {
      countBookComments: this.userBookComments.length,
      countAuthorComments: this.userAuthorComments.length,
      countBooks: this.userBookBookmarks.length,
      countAuthors: this.userAuthorBookmarks.length,
    };
  }
}
