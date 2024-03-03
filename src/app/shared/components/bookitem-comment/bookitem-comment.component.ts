import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { StarRatingModule } from 'angular-star-rating';
import { IBookCommentToClient } from '../../models/comment.model';
import { TruncateTextPipe } from '../../pipes/truncate-text.pipe';

@Component({
  selector: 'app-bookitem-comment',
  standalone: true,
  imports: [CommonModule, StarRatingModule, TruncateTextPipe],
  templateUrl: './bookitem-comment.component.html',
  styleUrl: './bookitem-comment.component.scss',
})
export class BookitemCommentComponent implements OnChanges {
  @Input({ required: true }) comment!: IBookCommentToClient;
  @Input() isUserComment: boolean = false;
  @Input() areUserBtnsActive: boolean = true;
  @Output() editCommentId = new EventEmitter<string>();
  @Output() deleteCommentId = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['areUserBtnsActive']) {
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
