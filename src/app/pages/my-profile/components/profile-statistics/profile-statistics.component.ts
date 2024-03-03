import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { CommentsService } from '../../../../core/services/comments.service';
import { BookmarkService } from '../../../../core/services/bookmark.service';
import {
  IAuthorCommentToClient,
  IBookCommentToClient,
} from '../../../../shared/models/comment.model';
import { FloatingMessageComponent } from '../../../../shared/components/floating-message/floating-message.component';

@Component({
  selector: 'app-profile-statistics',
  standalone: true,
  imports: [CommonModule, FloatingMessageComponent],
  templateUrl: './profile-statistics.component.html',
  styleUrl: './profile-statistics.component.scss',
})
export class ProfileStatisticsComponent implements OnInit {
  private commentsService = inject(CommentsService);
  private bookmarkService = inject(BookmarkService);

  @Input({ required: true }) userEmail!: string | null | undefined;

  loadingStatistics!: boolean;
  bookComments: IBookCommentToClient[] = [];
  avgRatingBooks!: number;
  authorComments: IAuthorCommentToClient[] = [];
  avgBookCountAuthor!: number;
  favouriteBooks: string[] = [];
  favouriteAuthors: string[] = [];

  async ngOnInit(): Promise<void> {
    this.loadingStatistics = true;
    if (this.userEmail) {
      this.bookComments = (await this.commentsService.getAllCommentsInUserData(
        this.userEmail,
        'books'
      )) as IBookCommentToClient[];
      this.authorComments =
        (await this.commentsService.getAllCommentsInUserData(
          this.userEmail,
          'authors'
        )) as IAuthorCommentToClient[];
      this.favouriteBooks =
        (await this.bookmarkService.getAllBookmarksInUserData(
          this.userEmail,
          'books'
        )) as string[];
      this.favouriteAuthors =
        (await this.bookmarkService.getAllBookmarksInUserData(
          this.userEmail,
          'authors'
        )) as string[];
    }

    this.getAvgRatings();

    this.loadingStatistics = false;
  }

  getAvgRatings() {
    this.avgRatingBooks = this.bookComments.length
      ? this.bookComments.reduce(
          (accumulator, currentValue) => accumulator + currentValue.rating,
          0
        ) / this.bookComments.length
      : 0;
    this.avgBookCountAuthor = this.authorComments.length
      ? this.authorComments.reduce(
          (accumulator, currentValue) => accumulator + currentValue.booksNumber,
          0
        ) / this.authorComments.length
      : 0;
  }
}
