import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../core/authentication/auth.service';
import { ProfileInfoComponent } from '../my-profile/components/profile-info/profile-info.component';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-account-settings',
  standalone: true,
  imports: [CommonModule, ProfileInfoComponent],
  templateUrl: './my-account-settings.component.html',
  styleUrl: './my-account-settings.component.scss',
})
export class MyAccountSettingsComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  loadingUser!: boolean;
  user: User | null = null;

  deleteMessage!: string;

  ngOnInit(): void {
    this.loadingUser = true;

    this.authService.user$.subscribe((data: User | null) => {
      this.user = data;
      this.loadingUser = false;
    });
  }

  sendVerification() {
    this.authService.sendEmailVerification().then(() => {
      console.log('Email verification was delived!');
    });
  }

  signout() {
    this.authService
      .logout()
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async deleteProfile() {
    this.deleteMessage = await this.authService.deleteAccount();
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 5000);
  }
}
