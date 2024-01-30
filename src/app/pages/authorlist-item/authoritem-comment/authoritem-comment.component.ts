import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { IAuthorCommentToClient } from '../../../shared/models/comment.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authoritem-comment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './authoritem-comment.component.html',
  styleUrl: './authoritem-comment.component.scss',
})
export class AuthoritemCommentComponent implements OnChanges {
  @Input({ required: true }) comment!: IAuthorCommentToClient;
  @Input() isUserComment: boolean = false;
  @Input() areUserBtnsActive: boolean = true;
  @Output() editCommentId = new EventEmitter<string>();
  @Output() deleteCommentId = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['areUserBtnsActive']) {
      console.log('change', changes['areUserBtnsActive'].currentValue);
      this.areUserBtnsActive = changes['areUserBtnsActive'].currentValue;
    }
  }

  editComment() {
    this.editCommentId.emit(this.comment.id);
  }

  deleteComment() {
    this.deleteCommentId.emit(this.comment.id);
  }
}
