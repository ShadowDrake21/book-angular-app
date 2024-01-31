import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UsersService } from '../../core/services/users.service';
import { BooksService } from '../../core/services/books.service';
import { AuthorsService } from '../../core/services/authors.service';
import { IUser } from '../../shared/models/user.model';
import { TruncateTextPipe } from '../../shared/pipes/truncate-text.pipe';
import { CommentsService } from '../../core/services/comments.service';

@Component({
  selector: 'app-userlist-item',
  standalone: true,
  imports: [CommonModule, RouterModule, TruncateTextPipe],
  templateUrl: './userlist-item.component.html',
  styleUrl: './userlist-item.component.scss',
})
export class UserlistItemComponent implements OnInit {
  route = inject(ActivatedRoute);
  usersService = inject(UsersService);
  booksService = inject(BooksService);
  authorsService = inject(AuthorsService);
  commentsService = inject(CommentsService);

  userId!: string;
  user!: IUser;
  isUserAvailable!: boolean;
  loadingUser!: boolean;

  ngOnInit(): void {
    this.userId = this.route.snapshot.url[1].path;
    console.log(this.userId);
    this.loadingUser = true;
    this.usersService
      .getUserById(this.userId)
      .then((res) => {
        this.user = res;
        this.isUserAvailable = true;
        this.loadingUser = false;
        this.getAllComments();
      })
      .catch((err) => {
        this.isUserAvailable = false;
      });
  }

  async getAllComments() {
    if (!this.user.email) return;
    await this.commentsService
      .getAllCommentsInUserData(this.user.email, 'books')
      .then((res) => {
        console.log(res);
      });
  }
}
