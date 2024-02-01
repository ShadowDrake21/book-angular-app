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
import { BookitemCommentComponent } from '../booklist-item/components/bookitem-comment/bookitem-comment.component';
import { AuthoritemCommentComponent } from '../authorlist-item/authoritem-comment/authoritem-comment.component';
import { BookmarkService } from '../../core/services/bookmark.service';
import { CarouselComponent } from '../../shared/components/carousel/carousel.component';
import { IBook, IWork } from '../../shared/models/book.model';
import { IAuthor } from '../../shared/models/author.model';

@Component({
  selector: 'app-userlist-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TruncateTextPipe,
    BookitemCommentComponent,
    AuthoritemCommentComponent,
    CarouselComponent,
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

  loadingAuthorBookmarks!: boolean;
  userAuthorBookmarks: string[] = [];

  loadingAuthors!: boolean;
  userAuthors: IAuthor[] = [];

  ngOnInit(): void {
    this.userId = this.route.snapshot.url[1].path;
    console.log(this.userId);
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

        this.userBookBookmarks = (await this.getAllBookmarks(
          'books'
        )) as string[];
        this.loadingBookBookmarks = false;

        this.userBookBookmarks.forEach((bookKey: string) => {
          this.booksService.getWorkByKey(bookKey).subscribe((book: IWork) => {
            this.userBooks.push(book);
            console.log(book);
          });
        });
        this.loadingBooks = false;
        console.log('book bookmarks length', this.userBookBookmarks.length);

        this.userAuthorBookmarks = (await this.getAllBookmarks(
          'authors'
        )) as string[];
        this.loadingAuthorBookmarks = false;

        this.userAuthorBookmarks.forEach((authorKey: string) => {
          this.authorsService
            .getAuthorByKey(authorKey)
            .subscribe((author: IAuthor) => {
              author.key = author.key.slice(9, author.key.length);
              this.userAuthors.push(author);
              console.log(author);
            });
        });
        this.loadingAuthors = false;
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

  async getBookByKey(bookKey: string): Promise<IBook> {
    try {
      const book: IBook = this.booksService.getWorkByKey(
        bookKey
      ) as unknown as IBook;
      return book;
    } catch (error) {
      throw error;
    }
  }
}
