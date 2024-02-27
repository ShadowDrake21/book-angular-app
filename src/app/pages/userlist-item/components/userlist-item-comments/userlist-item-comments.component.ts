import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  IAuthorCommentToClient,
  IBookCommentToClient,
} from '../../../../shared/models/comment.model';
import { CommonModule } from '@angular/common';
import { AuthoritemCommentComponent } from '../../../../shared/components/authoritem-comment/authoritem-comment.component';
import { BookitemCommentComponent } from '../../../../shared/components/bookitem-comment/bookitem-comment.component';

@Component({
  selector: 'app-userlist-item-comments',
  standalone: true,
  imports: [CommonModule, BookitemCommentComponent, AuthoritemCommentComponent],
  templateUrl: './userlist-item-comments.component.html',
  styleUrl: './userlist-item-comments.component.scss',
})
export class UserlistItemCommentsComponent implements OnInit, OnChanges {
  @Input() type: 'books' | 'authors' = 'books';
  @Input() bookComments: IBookCommentToClient[] = [];
  @Input() authorComments: IAuthorCommentToClient[] = [];
  @Input() loadingComments!: boolean;

  recentBookComments: IBookCommentToClient[] = [];
  recentAuthorComments: IAuthorCommentToClient[] = [];

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['loadingComments']) {
      this.loadingComments = changes['loadingComments'].currentValue;
    }
    if (changes['bookComments']) {
      this.bookComments = changes['bookComments'].currentValue;
      this.bookComments = this.sortComments(
        this.bookComments
      ) as IBookCommentToClient[];

      this.recentBookComments = this.getRecentComments(
        this.bookComments,
        3
      ) as IBookCommentToClient[];
    }
    if (changes['authorComments']) {
      this.authorComments = changes['authorComments'].currentValue;

      this.authorComments = this.sortComments(
        this.authorComments
      ) as IAuthorCommentToClient[];

      this.recentAuthorComments = this.getRecentComments(
        this.authorComments,
        3
      ) as IAuthorCommentToClient[];
    }
  }

  sortComments(
    allComments: IBookCommentToClient[] | IAuthorCommentToClient[]
  ): IBookCommentToClient[] | IAuthorCommentToClient[] {
    allComments.sort(function compare(a, b) {
      let dateA = new Date(a.date).getTime();
      let dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
    return allComments;
  }

  getRecentComments(
    allComments: IBookCommentToClient[] | IAuthorCommentToClient[],
    count: number
  ): IBookCommentToClient[] | IAuthorCommentToClient[] {
    return allComments.slice(0, count);
  }
}
