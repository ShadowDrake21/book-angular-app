import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { AuthService } from '../../../core/authentication/auth.service';
import { CommentsService } from '../../../core/services/comments.service';
import { AuthorsService } from '../../../core/services/authors.service';
import {
  IAuthorCommentToClient,
  IAuthorCommentToDB,
  IBookCommentToClient,
  ICommentResult,
  INeededUserInfo,
} from '../../../shared/models/comment.model';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/UI/button/button.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';
import { AuthoritemCommentComponent } from '../authoritem-comment/authoritem-comment.component';

@Component({
  selector: 'app-authoritem-comments-section',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    ReactiveFormsModule,
    AuthoritemCommentComponent,
  ],
  templateUrl: './authoritem-comments-section.component.html',
  styleUrl: './authoritem-comments-section.component.scss',
})
export class AuthoritemCommentsSectionComponent implements OnInit, OnChanges {
  authService = inject(AuthService);
  authorsService = inject(AuthorsService);
  commentsService = inject(CommentsService);

  @Input() authorId!: string;
  @Input() neededUserInfo: INeededUserInfo = { email: '', photoURL: '' };

  commentForm = new FormGroup({
    id: new FormControl(''),
    booksNumber: new FormControl('', Validators.required),
    comment: new FormControl('', Validators.required),
  });

  commentFormBtn = 'Post';

  isRatingSet: boolean = true;
  isUserHasComment: boolean = false;

  commentPostedResult!: ICommentResult | undefined;
  commentEditedResult!: ICommentResult | undefined;
  commentDeletedResult!: ICommentResult | undefined;

  comments: IAuthorCommentToClient[] = [];
  userComment: IAuthorCommentToClient | undefined = undefined;

  async ngOnInit(): Promise<void> {
    await this.commentsService
      .checkUserHasAuthorComment(this.authorId, this.neededUserInfo.email)
      .then((res) => {
        console.log(this.authorId, this.neededUserInfo.email);
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
    if (!this.commentForm.value.comment) {
      return;
    } else if (!this.commentForm.value.booksNumber) {
      return;
    }

    const commentObj: IAuthorCommentToDB = {
      id: this.commentForm.value.id,
      email: this.neededUserInfo.email,
      comment: this.commentForm.value.comment,
      booksNumber: parseInt(this.commentForm.value.booksNumber),
      date: Timestamp.now(),
      photoURL: this.neededUserInfo.photoURL,
    };
    if (this.commentFormBtn === 'Post') {
      this.commentsService
        .addNewAuthorComment(this.authorId, commentObj.id, commentObj)
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
        .updateAuthorComment(this.authorId, commentObj.id, commentObj)
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
    const comments = await this.commentsService.getAllCommentsByAuthor(
      this.authorId
    );
    this.comments = comments;
  }

  editComment(commentId: string) {
    this.commentFormBtn = 'Edit';
    let choosenComment: IAuthorCommentToClient | undefined = undefined;
    this.commentsService
      .getAuthorComment(this.authorId, commentId)
      .then((comments) => {
        this.enableForm();
        choosenComment = comments[0];
        this.commentForm.controls.comment.enable();
        this.commentForm.controls.booksNumber.enable();
        this.commentForm.controls.id.setValue(choosenComment.id);
        this.commentForm.controls.comment.setValue(choosenComment.comment);
        this.commentForm.controls.booksNumber.setValue(
          choosenComment.booksNumber.toString()
        );
      });
  }

  deleteComment(commentId: string) {
    this.commentsService
      .deleteAuthorComment(this.authorId, commentId)
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
    this.commentForm.disable();
    console.log('form disabled!');
  }

  enableForm(): void {
    this.commentForm.enable();
  }
}
