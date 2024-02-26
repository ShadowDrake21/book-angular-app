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
  INeededUserInfo,
} from '../../../../shared/models/comment.model';
import { AuthService } from '../../../../core/authentication/auth.service';
import { BooksService } from '../../../../core/services/books.service';
import { CommentsService } from '../../../../core/services/comments.service';
import { Timestamp } from '@angular/fire/firestore';
import { BookitemCommentComponent } from '../../../../shared/components/bookitem-comment/bookitem-comment.component';
import { IItemResult } from '../../../../shared/models/general.model';

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
  @Input() neededUserInfo: INeededUserInfo = { email: '' };

  commentForm = new FormGroup({
    id: new FormControl(''),
    rating: new FormControl('', Validators.required),
    comment: new FormControl('', Validators.required),
  });

  commentFormBtn = 'Post';

  isRatingSet: boolean = true;
  isUserHasComment: boolean = false;

  commentActionsResult!: IItemResult | undefined;

  comments: IBookCommentToClient[] = [];
  userComment: IBookCommentToClient | undefined = undefined;

  areUserBtnsActive: boolean = true;

  async ngOnInit(): Promise<void> {
    await this.commentsService
      .checkUserHasComment('books', this.bookId, this.neededUserInfo.email)
      .then((res) => {
        if (res === true) {
          this.disableForm();
        }
      });
    await this.getAllComments().then(async () => {
      this.getUserComment(this.neededUserInfo.email);
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
    };
    if (this.commentFormBtn === 'Post') {
      this.commentsService
        .addNewComment('books', this.bookId, commentObj.id, commentObj)
        .then(async () => {
          this.commentActionsResult = {
            isSuccessfull: true,
            message: 'Review successfully added!',
          };
          await this.getAllComments().then(async () => {
            await this.getUserComment(this.neededUserInfo.email);
          });
          this.getUserComment(this.neededUserInfo.email);
          this.areUserBtnsActive = false;
          this.disableForm();
        })
        .catch((err) => {
          this.areUserBtnsActive = false;
          this.commentActionsResult = {
            isSuccessfull: false,
            message: err.toString(),
          };
        });
      setTimeout(() => {
        this.areUserBtnsActive = true;
        this.commentActionsResult = undefined;
      }, 3000);
    } else {
      this.commentsService
        .updateComment('books', this.bookId, commentObj.id, commentObj)
        .then(async () => {
          this.commentActionsResult = {
            isSuccessfull: true,
            message: 'Review successfully edited!',
          };
          await this.getAllComments().then(async () => {
            await this.getUserComment(this.neededUserInfo.email);
          });
          this.getUserComment(this.neededUserInfo.email);
          this.areUserBtnsActive = false;
          this.disableForm();
        })
        .catch((err) => {
          this.areUserBtnsActive = false;
          this.commentActionsResult = {
            isSuccessfull: false,
            message: err.toString(),
          };
        });
      setTimeout(() => {
        this.areUserBtnsActive = true;
        this.commentActionsResult = undefined;
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
    this.commentsService
      .getBookComment(this.bookId, commentId)
      .then((comment) => {
        this.enableForm();
        choosenComment = comment;
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
      .deleteComment('books', this.bookId, commentId, this.neededUserInfo.email)
      .then(async () => {
        this.commentActionsResult = {
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
        this.commentActionsResult = {
          isSuccessfull: false,
          message: err.toString(),
        };
      });
    setTimeout(() => {
      this.commentActionsResult = undefined;
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
  }

  enableForm(): void {
    this.commentForm.controls.comment.enable();
  }
}
