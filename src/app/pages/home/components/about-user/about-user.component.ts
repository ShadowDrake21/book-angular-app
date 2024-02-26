import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { BooksService } from '../../../../core/services/books.service';
import { AuthService } from '../../../../core/authentication/auth.service';
import { User, getAuth } from '@angular/fire/auth';
import { IUpdateProfile } from '../../../../shared/models/profileManipulations.model';
import { aboutUser } from '../../mocks/home.mocks';
import { UsersService } from '../../../../core/services/users.service';
import { IUser } from '../../../../shared/models/user.model';
import { IActivity } from '../../../../shared/models/activity.model';
import { AuthorsService } from '../../../../core/services/authors.service';
import { BookmarkService } from '../../../../core/services/bookmark.service';
import { CommentsService } from '../../../../core/services/comments.service';
import { FriendsManagementService } from '../../../../core/services/friends-management.service';

@Component({
  selector: 'app-about-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-user.component.html',
  styleUrl: './about-user.component.scss',
})
export class AboutUserComponent implements OnInit {
  private authService = inject(AuthService);
  private bookmarkService = inject(BookmarkService);
  private commentsService = inject(CommentsService);
  private friendsManagementService = inject(FriendsManagementService);

  loadingUser!: boolean;
  user!: User | null;

  loadingAboutUser!: boolean;
  aboutUser!: IActivity;

  async ngOnInit(): Promise<void> {
    this.loadingUser = true;
    this.loadingAboutUser = true;
    await this.getUserInfo();
  }

  async getUserInfo() {
    return new Promise<void>((resolve) => {
      this.authService.user$.subscribe((res) => {
        this.user = res;
        this.loadingUser = false;

        if (this.user?.email) {
          this.formAboutUser().then(() => {
            this.loadingAboutUser = false;
            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  }

  async formAboutUser() {
    if (!this.user?.email) return;

    const [
      booksBookmarks,
      authorsBookmarks,
      booksComments,
      authorsComments,
      friendsRequests,
    ] = await Promise.all([
      this.bookmarkService.getAllBookmarksInUserData(this.user.email, 'books'),
      this.bookmarkService.getAllBookmarksInUserData(
        this.user.email,
        'authors'
      ),
      this.commentsService.getAllCommentsInUserData(this.user.email, 'books'),
      this.commentsService.getAllCommentsInUserData(this.user.email, 'authors'),
      this.friendsManagementService.getAllGottenFriendRequests(
        this.user.email,
        'gottenRequests'
      ),
    ]);

    this.aboutUser = {
      likedBooks: booksBookmarks.length,
      likedAuthors: authorsBookmarks.length,
      writtenReviewsBooks: booksComments.length,
      writtenReviewsAuthors: authorsComments.length,
      notifications: friendsRequests.length,
    };
    console.log('aboutUser', this.aboutUser);
    this.loadingAboutUser = false;
  }
}
