import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { TruncateTextPipe } from '../../../../pipes/truncate-text.pipe';
import { profile } from '../../content/header.content';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { AuthService } from '../../../../../core/authentication/auth.service';

@Component({
  selector: 'app-profile-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    ClickOutsideDirective,
    TruncateTextPipe,
  ],
  templateUrl: './profile-dropdown.component.html',
  styleUrl: './profile-dropdown.component.scss',
})
export class ProfileDropdownComponent {
  authService = inject(AuthService);
  router = inject(Router);

  @Input({ required: true }) userEmail: string = '';
  @Input({ required: true }) clickedLi!: string;

  faUser = faUser;
  profile = profile;
  isProfileOpened: boolean = false;

  toggleProfile(): void {
    this.isProfileOpened = !this.isProfileOpened;
  }

  clickedProfileOutside(): void {
    this.isProfileOpened = false;
  }
  onLogout() {
    this.authService
      .logout()
      .then(() => {
        console.log('user is logged out');
        this.router.navigate(['/']);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
