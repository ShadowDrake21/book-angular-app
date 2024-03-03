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
import { UserlistItemCommentsComponent } from './components/userlist-item-comments/userlist-item-comments.component';
import { UserlistItemFriendsManagementComponent } from './components/userlist-item-friends-management/userlist-item-friends-management.component';
import { UseritemBookmarksComponent } from '../../shared/components/useritem-bookmarks/useritem-bookmarks.component';
import { UseritemPrebookmarksComponent } from '../../shared/components/useritem-prebookmarks/useritem-prebookmarks.component';
import { AuthService } from '../../core/authentication/auth.service';

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
    UserlistItemFriendsManagementComponent,
    UseritemBookmarksComponent,
    UserlistItemCommentsComponent,
    UseritemPrebookmarksComponent,
  ],
  templateUrl: './userlist-item.component.html',
  styleUrl: './userlist-item.component.scss',
})
export class UserlistItemComponent implements OnInit {
  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  usersService = inject(UsersService);
  booksService = inject(BooksService);
  authorsService = inject(AuthorsService);
  commentsService = inject(CommentsService);
  bookmarkService = inject(BookmarkService);

  myEmail!: string | null | undefined;
  userId!: string;
  user!: IUser;
  isUserAvailable!: boolean;
  loadingUser!: boolean;

  loadingBookComments!: boolean;
  userBookComments: IBookCommentToClient[] = [];

  loadingAuthorComments!: boolean;
  userAuthorComments: IAuthorCommentToClient[] = [];

  loadingCountBooks!: boolean;
  countBooks!: number;
  loadingCountAuthors!: boolean;
  countAuthors!: number;

  recentBookComments: IBookCommentToClient[] = [];
  recentAuthorComments: IAuthorCommentToClient[] = [];

  details!: IUserDetails;

  ngOnInit(): void {
    this.userId = this.route.snapshot.url[1].path;
    this.loadingUser = true;
    this.loadingBookComments = true;
    this.loadingAuthorComments = true;
    this.authService.user$.subscribe((user) => {
      this.myEmail = user?.email;
    });
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
        await new Promise((resolve) => setTimeout(resolve, 2000));
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

  formDetails(): IUserDetails {
    return {
      countBookComments: this.userBookComments.length,
      countAuthorComments: this.userAuthorComments.length,
      countBooks: this.countBooks,
      countAuthors: this.countAuthors,
    };
  }

  getCountBooks(value: number) {
    this.countBooks = value;
  }

  getCountAuthors(value: number) {
    this.countAuthors = value;
  }
}
