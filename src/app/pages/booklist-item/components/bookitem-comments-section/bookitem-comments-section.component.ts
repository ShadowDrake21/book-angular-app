import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/UI/button/button.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StarRatingModule } from 'angular-star-rating';
import {
  IBookCommentToClient,
  IBookCommentToDB,
  ICommentResult,
  INeededUserInfo,
} from '../../../../shared/models/comment.model';
import { AuthService } from '../../../../core/authentication/auth.service';
import { BooksService } from '../../../../core/services/books.service';
import { CommentsService } from '../../../../core/services/comments.service';
import { Timestamp } from '@angular/fire/firestore';
import { BookitemCommentComponent } from '../bookitem-comment/bookitem-comment.component';

@Component({
  selector: 'app-bookitem-comments-section',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    ReactiveFormsModule,
    StarRatingModule,
    BookitemCommentComponent,
  ],
  templateUrl: './bookitem-comments-section.component.html',
  styleUrl: './bookitem-comments-section.component.scss',
})
export class BookitemCommentsSectionComponent implements OnInit, OnChanges {
  authService = inject(AuthService);
  booksService = inject(BooksService);
  commentsService = inject(CommentsService);

  @Input() bookId!: string;
  @Input() neededUserInfo: INeededUserInfo = { email: '', photoURL: '' };

  commentForm = new FormGroup({
    id: new FormControl(''),
    rating: new FormControl('', Validators.required),
    comment: new FormControl('', Validators.required),
  });

  commentFormBtn = 'Post';

  isRatingSet: boolean = true;
  isUserHasComment: boolean = false;

  commentPostedResult!: ICommentResult | undefined;
  commentEditedResult!: ICommentResult | undefined;
  commentDeletedResult!: ICommentResult | undefined;

  comments: IBookCommentToClient[] = [];
  userComment: IBookCommentToClient | undefined = undefined;

  async ngOnInit(): Promise<void> {
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['neededUserInfo']) {
      this.neededUserInfo = changes['neededUserInfo'].currentValue;
    }
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

  disableForm(): void {
    this.commentForm.controls.comment.disable();
    console.log('form disabled!');
  }

  enableForm(): void {
    this.commentForm.controls.comment.enable();
  }
}
