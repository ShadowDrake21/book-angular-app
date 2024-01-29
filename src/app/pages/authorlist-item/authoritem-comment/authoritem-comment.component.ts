import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IAuthorCommentToClient } from '../../../shared/models/comment.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authoritem-comment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './authoritem-comment.component.html',
  styleUrl: './authoritem-comment.component.scss',
})
export class AuthoritemCommentComponent {
  @Input({ required: true }) comment!: IAuthorCommentToClient;
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
