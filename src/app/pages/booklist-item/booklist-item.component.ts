import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { BooksService } from '../../core/services/books.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IBookExternalInfo, IWork } from '../../shared/models/book.model';
import { BookImagePipe } from '../../shared/pipes/book-image.pipe';
import { CommonModule } from '@angular/common';
import { TruncateTextPipe } from '../../shared/pipes/truncate-text.pipe';
import { ObjectManipulations } from '../../shared/utils/objectManipulations.utils';
import { IAuthor } from '../../shared/models/author.model';
import { AuthorImagePipe } from '../../shared/pipes/author-image.pipe';
import { ButtonComponent } from '../../shared/components/UI/button/button.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RatingChangeEvent, StarRatingModule } from 'angular-star-rating';
import { AuthService } from '../../core/authentication/auth.service';
import {
  IBookCommentToClient,
  IBookCommentToDB,
  ICommentResult,
  INeededUserInfo,
} from '../../shared/models/comment.model';
import { CommentsService } from '../../core/services/comments.service';
import { Subscription } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';
import { BookmarkButtonComponent } from '../../shared/components/bookmark-button/bookmark-button.component';
import { BookmarkService } from '../../core/services/bookmark.service';

@Component({
  selector: 'app-booklist-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BookImagePipe,
    AuthorImagePipe,
    TruncateTextPipe,
    ButtonComponent,
    ReactiveFormsModule,
    StarRatingModule,
    BookmarkButtonComponent,
  ],
  templateUrl: './booklist-item.component.html',
  styleUrl: './booklist-item.component.scss',
})
export class BooklistItemComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  booksService = inject(BooksService);
  commentsService = inject(CommentsService);
  bookmarkService = inject(BookmarkService);

  private subscription!: Subscription;
  neededUserInfo: INeededUserInfo = { email: '', photoURL: '' };
  isUserHasComment: boolean = false;

  bookId!: string;
  bookExternalData!: IBookExternalInfo;
  loadingBook?: boolean;

  book!: IWork;
  mainCover!: string;

  descriptionBtn: string = 'Show more';
  descriptionShowLength: number = 300;
  isDescriptionFullText: boolean = false;

  basicToggleItems: number = 5;

  characters: string[] = [];
  charactersBtn: string = 'Show all characters';
  isAllCharacters: boolean = false;

  places: string[] = [];
  placesBtn: string = 'Show all places';
  isAllPlaces: boolean = false;

  subjects: string[] = [];
  subjectsBtn: string = 'Show all subjects';
  isAllSubjects: boolean = false;

  authors: IAuthor[] = [];
  authorKeys: string[] = [];
  loadingAuthor?: boolean;

  commentForm = new FormGroup({
    id: new FormControl(''),
    rating: new FormControl('', Validators.required),
    comment: new FormControl('', Validators.required),
  });
  commentFormBtn = 'Post';

  isRatingSet: boolean = true;

  commentPostedResult!: ICommentResult | undefined;
  commentEditedResult!: ICommentResult | undefined;
  commentDeletedResult!: ICommentResult | undefined;

  comments: IBookCommentToClient[] = [];
  userComment: IBookCommentToClient | undefined = undefined;

  isBookmarked: boolean = false;

  ngOnInit(): void {
    this.subscription = this.authService.user$.subscribe(async (data) => {
      if (!data?.email || !data.photoURL) return;
      this.neededUserInfo.email = data?.email;
      this.neededUserInfo.photoURL = data?.photoURL;
      console.log('our neededInfo: ', this.neededUserInfo);
      this.commentsService
        .checkUserHasComment(this.bookId, this.neededUserInfo.email)
        .then((res) => {
          console.log(this.bookId, this.neededUserInfo.email);
          if (res === true) {
            this.disableForm();
          }
        });
      await this.getAllComments().then(async () => {
        await this.getUserComment(this.neededUserInfo.email);
      });
      console.log('user comment', this.userComment);
      this.bookmarkService
        .checkUserHasBookBookmark(this.neededUserInfo.email, this.bookId)
        .then((res: boolean) => {
          this.isBookmarked = res;
        });
    });

    const externalDataParams =
      this.route.snapshot.queryParamMap.get('externalData');

    if (externalDataParams !== null) {
      this.bookExternalData = JSON.parse(externalDataParams);
      console.log(this.bookExternalData);
    }

    this.bookId = this.route.snapshot.url[1].path;

    this.loadingBook = true;
    this.booksService.getWorkByKey(this.bookId).subscribe((res) => {
      this.book = res;
      this.mainCover = this.book.covers && this.book.covers[0].toString();
      this.characters = ObjectManipulations.checkIfHasKey(
        this.book,
        'subject_people'
      )
        ? this.book.subject_people.slice(0, this.basicToggleItems)
        : [];
      this.places = ObjectManipulations.checkIfHasKey(
        this.book,
        'subject_places'
      )
        ? this.book.subject_places.slice(0, this.basicToggleItems)
        : [];
      this.subjects = ObjectManipulations.checkIfHasKey(this.book, 'subjects')
        ? this.book.subjects.slice(0, this.basicToggleItems)
        : [];
      console.log(this.book);
      this.loadingAuthor = true;
      this.getAuthors();
      this.loadingBook = false;
    });
    console.log('length: ', this.comments.length);
  }

  showCloseDescription() {
    let descriptionLength = this.book.description.value
      ? this.book.description.value.length
      : this.book.description.toString().length;
    if (this.descriptionBtn === 'Show more') {
      this.descriptionBtn = 'Hide';
      this.descriptionShowLength = descriptionLength;
      this.isDescriptionFullText = true;
    } else {
      this.descriptionBtn = 'Show more';
      this.descriptionShowLength = 300;
      this.isDescriptionFullText = false;
    }
  }

  toggleList(type: string) {
    switch (type) {
      case 'characters':
        if (!this.isAllCharacters) {
          this.characters = [];
          this.characters = this.book.subject_people;
          this.isAllCharacters = true;
          this.charactersBtn = 'Hide';
        } else {
          this.characters = [];
          this.characters = this.book.subject_people.slice(
            0,
            this.basicToggleItems
          );
          this.isAllCharacters = false;
          this.charactersBtn = 'Show all characters';
        }
        break;
      case 'places':
        if (!this.isAllPlaces) {
          this.places = [];
          this.places = this.book.subject_places;
          this.isAllPlaces = true;
          this.placesBtn = 'Hide';
        } else {
          this.places = [];
          this.places = this.book.subject_places.slice(
            0,
            this.basicToggleItems
          );
          this.isAllPlaces = false;
          this.placesBtn = 'Show all';
        }
        break;
      case 'subjects':
        if (!this.isAllSubjects) {
          this.subjects = [];
          this.subjects = this.book.subjects;
          this.isAllSubjects = true;
          this.subjectsBtn = 'Hide';
        } else {
          this.subjects = [];
          this.subjects = this.book.subjects.slice(0, this.basicToggleItems);
          this.isAllSubjects = false;
          this.subjectsBtn = 'Show all';
        }
        break;
    }
  }

  getAuthors() {
    for (const author of this.book.authors) {
      let authorKey = author.author.key.slice(9, author.author.key.length);
      this.authorKeys.push(authorKey);
      this.booksService.getAuthorByKey(authorKey).subscribe((res) => {
        this.authors.push(res);
        console.log(this.authors);
      });
    }
    this.loadingAuthor = false;
  }

  async onCommentFormSubmit() {
    if (!this.commentForm.value.id) {
      this.commentForm.value.id = 'id' + Math.random().toString(16).slice(2);
    }
    if (!this.commentForm.value.rating) {
      this.isRatingSet = false;
      return;
    } else if (!this.commentForm.value.comment) {
      return;
    }
    this.isRatingSet = true;

    const commentObj: IBookCommentToDB = {
      id: this.commentForm.value.id,
      email: this.neededUserInfo.email,
      comment: this.commentForm.value.comment,
      rating: parseInt(this.commentForm.value.rating),
      date: Timestamp.now(),
      photoURL: this.neededUserInfo.photoURL,
    };
    if (this.commentFormBtn === 'Post') {
      this.commentsService
        .addNewComment(this.bookId, commentObj.id, commentObj)
        .then(async () => {
          this.commentPostedResult = {
            isSuccessfull: true,
            message: 'Review successfully added!',
          };
          await this.getAllComments().then(async () => {
            await this.getUserComment(this.neededUserInfo.email);
          });
          this.getUserComment(this.neededUserInfo.email);
          this.disableForm();
        })
        .catch((err) => {
          this.commentPostedResult = {
            isSuccessfull: false,
            message: err.toString(),
          };
        });
      setTimeout(() => {
        this.commentPostedResult = undefined;
      }, 3000);
    } else {
      this.commentsService
        .updateComment(this.bookId, commentObj.id, commentObj)
        .then(async () => {
          this.commentEditedResult = {
            isSuccessfull: true,
            message: 'Review successfully edited!',
          };
          await this.getAllComments().then(async () => {
            await this.getUserComment(this.neededUserInfo.email);
          });
          this.getUserComment(this.neededUserInfo.email);
          this.disableForm();
        })
        .catch((err) => {
          this.commentPostedResult = {
            isSuccessfull: false,
            message: err.toString(),
          };
        });
      setTimeout(() => {
        this.commentEditedResult = undefined;
      }, 3000);
    }
    this.commentForm.reset();
    this.commentFormBtn = 'Post';
  }

  async getAllComments() {
    const comments = await this.commentsService.getAllCommentsByBook(
      this.bookId
    );
    this.comments = comments;
  }

  editComment(commentId: string) {
    this.commentFormBtn = 'Edit';
    let choosenComment: IBookCommentToClient | undefined = undefined;
    this.commentsService.getComment(this.bookId, commentId).then((comments) => {
      this.enableForm();
      choosenComment = comments[0];
      this.commentForm.controls.comment.enable();
      this.commentForm.controls.rating.enable();
      this.commentForm.controls.id.setValue(choosenComment.id);
      this.commentForm.controls.comment.setValue(choosenComment.comment);
      this.commentForm.controls.rating.setValue(
        choosenComment.rating.toString()
      );
    });
  }

  deleteComment(commentId: string) {
    this.commentsService
      .deleteComment(this.bookId, commentId)
      .then(async () => {
        this.commentDeletedResult = {
          isSuccessfull: true,
          message: 'Review successfully deleted!',
        };
        await this.getAllComments().then(async () => {
          await this.getUserComment(this.neededUserInfo.email);
        });
        this.getUserComment(this.neededUserInfo.email);
        this.enableForm();
      })
      .catch((err) => {
        this.commentDeletedResult = {
          isSuccessfull: false,
          message: err.toString(),
        };
      });
    setTimeout(() => {
      this.commentDeletedResult = undefined;
    }, 3000);
  }

  getUserComment(email: string) {
    if (this.comments.length) {
      this.userComment = this.comments.find((item) => item.email === email);
    } else {
      this.userComment = undefined;
    }
  }

  isString(value: any): boolean {
    return typeof value === 'string';
  }

  disableForm(): void {
    this.commentForm.controls.comment.disable();
  }

  enableForm(): void {
    this.commentForm.controls.comment.enable();
  }

  getBookmarkedChange(bookmarkedChange: boolean) {
    this.isBookmarked = bookmarkedChange;

    if (this.isBookmarked) {
      this.addBookmark();
    } else {
      this.deleteBookmark();
    }
  }

  addBookmark() {
    this.bookmarkService
      .addNewBookBookmark(this.neededUserInfo.email, this.bookId)
      .then(() => {
        console.log('bookmark added');
      });
  }

  deleteBookmark() {
    this.bookmarkService
      .deleteBookBookmark(this.neededUserInfo.email, this.bookId)
      .then(() => {
        console.log('bookmark deleted');
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
