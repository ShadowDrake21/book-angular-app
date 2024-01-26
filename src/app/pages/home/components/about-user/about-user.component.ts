import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { BooksService } from '../../../../core/services/books.service';
import { AuthService } from '../../../../core/authentication/auth.service';
import { User, getAuth } from '@angular/fire/auth';
import { IUpdateProfile } from '../../../../shared/models/profileManipulations.model';
import { aboutUser } from '../../mocks/home.mocks';

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

  user!: User | null;

  aboutUser = aboutUser;

  ngOnInit(): void {
    // this.updateUser();
    this.getUserInfo();
  }

  getUserInfo() {
    this.authService.user$.subscribe((res) => {
      this.user = res;
      console.log(this.user);
    });
  }

  updateUser() {
    const auth = getAuth();
    console.log(auth.currentUser);
    if (auth.currentUser) {
      this.authService
        .updateProfile(auth.currentUser, {
          displayName: 'Nikola',
          photoURL:
            'https://i.ytimg.com/vi/KMto3R0-LBo/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB7bD0lZBwA0M9q6pY2etk0Wq837g',
        } as IUpdateProfile)
        .then(() => {
          console.log('Profile updated!');
        })
        .catch((error) => {
          console.log('Error while profile updating!', error);
        });
    }
  }
}
