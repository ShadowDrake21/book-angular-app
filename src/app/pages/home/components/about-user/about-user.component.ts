import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { BooksService } from '../../../../core/services/books.service';
import { AuthService } from '../../../../core/authentication/auth.service';
import { User, getAuth } from '@angular/fire/auth';
import { IUpdateProfile } from '../../../../shared/models/profileManipulations.model';
import { aboutUser } from '../../mocks/home.mocks';
import { UsersService } from '../../../../core/services/users.service';
import { IUser } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-about-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-user.component.html',
  styleUrl: './about-user.component.scss',
})
export class AboutUserComponent implements OnInit {
  authService = inject(AuthService);
  booksService = inject(BooksService);
  usersService = inject(UsersService);

  user!: User | null;
  loadingUser!: boolean;

  aboutUser = aboutUser;

  async ngOnInit(): Promise<void> {
    this.loadingUser = true;
    this.getUserInfo();
  }

  getUserInfo() {
    this.authService.user$.subscribe((res) => {
      this.user = res;
      this.loadingUser = false;
    });
  }
}
