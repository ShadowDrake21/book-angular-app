import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StarRatingModule } from 'angular-star-rating';
import { IBookCommentToClient } from '../../../../shared/models/comment.model';

@Component({
  selector: 'app-bookitem-comment',
  standalone: true,
  imports: [CommonModule, StarRatingModule],
  templateUrl: './bookitem-comment.component.html',
  styleUrl: './bookitem-comment.component.scss',
})
export class BookitemCommentComponent {
  @Input({ required: true }) comment!: IBookCommentToClient;
  @Input() isUserComment: boolean = false;
  @Output() editCommentId = new EventEmitter<string>();
  @Output() deleteCommentId = new EventEmitter<string>();

  editComment() {
    this.editCommentId.emit(this.comment.id);
  }

  deleteComment() {
    this.deleteCommentId.emit(this.comment.id);
  }
}
