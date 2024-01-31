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

  aboutUser = aboutUser;

  async ngOnInit(): Promise<void> {
    this.getUserInfo();
  }

  getUserInfo() {
    this.authService.user$.subscribe((res) => {
      this.user = res;
      // this.updateUser();
      console.log(this.user);
    });
  }

  updateUser() {
    const auth = getAuth();
    if (this.user?.email) {
      this.authService.retrieveUserData(this.user?.email).then((res) => {
        const retrieveUserInfo: IUser = res[0];
        const updatedData: IUpdateProfile = {
          displayName: 'Nikola Doktor Book',
          photoURL: 'https://i.ytimg.com/vi/wy2PERFwae4/maxresdefault.jpg',
        };

        if (auth.currentUser) {
          this.authService
            .updateProfile(auth.currentUser, updatedData)
            .then(() => {
              this.usersService.updateUser(retrieveUserInfo.id, updatedData);
              console.log('Profile updated!');
            })
            .catch((error) => {
              console.log('Error while profile updating!', error);
            });
        }
      });
    }
  }
}
