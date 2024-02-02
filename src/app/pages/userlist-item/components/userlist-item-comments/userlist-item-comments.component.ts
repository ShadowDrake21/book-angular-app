import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import {
  IAuthorCommentToClient,
  IBookCommentToClient,
} from '../../../../shared/models/comment.model';
import { CommonModule } from '@angular/common';
import { AuthoritemCommentComponent } from '../../../authorlist-item/authoritem-comment/authoritem-comment.component';
import { BookitemCommentComponent } from '../../../booklist-item/components/bookitem-comment/bookitem-comment.component';

@Component({
  selector: 'app-userlist-item-comments',
  standalone: true,
  imports: [CommonModule, BookitemCommentComponent, AuthoritemCommentComponent],
  templateUrl: './userlist-item-comments.component.html',
  styleUrl: './userlist-item-comments.component.scss',
})
export class UserlistItemCommentsComponent implements OnInit, OnChanges {
  @Input() bookComments: IBookCommentToClient[] = [];
  @Input() authorComments: IAuthorCommentToClient[] = [];
  @Input() loadingComments!: boolean;

  recentBookComments: IBookCommentToClient[] = [];
  recentAuthorComments: IAuthorCommentToClient[] = [];

  ngOnInit(): void {
    console.log(this.bookComments);
    console.log(this.authorComments);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['loadingComments']) {
      this.loadingComments = changes['loadingComments'].currentValue;
    }
    if (changes['bookComments']) {
      this.bookComments = changes['bookComments'].currentValue;
      console.log(this.bookComments);
      this.bookComments = this.sortComments(
        this.bookComments
      ) as IBookCommentToClient[];

      this.recentBookComments = this.getRecentComments(
        this.authorComments,
        3
      ) as IBookCommentToClient[];
      console.log('recent recentBookComments', this.recentBookComments);
    }
    if (changes['authorComments']) {
      this.authorComments = changes['authorComments'].currentValue;
      console.log(this.authorComments);

      this.authorComments = this.sortComments(
        this.authorComments
      ) as IAuthorCommentToClient[];

      this.recentAuthorComments = this.getRecentComments(
        this.authorComments,
        3
      ) as IAuthorCommentToClient[];
      console.log('recent author', this.recentAuthorComments);
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
    console.log('recent comments', allComments);
    return allComments.slice(0, count);
  }
}
