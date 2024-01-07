import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import { SearchInputComponent } from '../search-input/search-input.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { CommonModule } from '@angular/common';
import { Notification, Profile } from '../../models/dropmenu.model';
import { AuthService } from '../../../core/authentication/auth.service';
import { User } from '@angular/fire/auth';
import { profile } from './content/header.content';
import { notifications } from './mocks/header.mocks';
import { TruncateTextPipe } from '../../pipes/truncate-text.pipe';
import { ProfileDropdownComponent } from './components/profile-dropdown/profile-dropdown.component';
import { NotificationsDropdownComponent } from './components/notifications-dropdown/notifications-dropdown.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    SearchInputComponent,
    TruncateTextPipe,
    NotificationsDropdownComponent,
    ProfileDropdownComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  faEnvelope = faEnvelope;
  faUser = faUser;

  public user!: User | null;
  public userEmail: string = '';

  constructor(private authService: AuthService) {
    this.authService.user$.subscribe((res) => {
      this.user = res;
      if (this.user?.email) {
        this.userEmail = this.user.email;
      }
    });
  }

  clickedLi: string = 'background-color: rgb(122, 122, 122); color: #fff;';
}
