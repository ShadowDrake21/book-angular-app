import { Component, Input } from '@angular/core';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { profile } from '../../content/header.content';
import { TruncateTextPipe } from '../../../../pipes/truncate-text.pipe';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { notifications } from '../../mocks/header.mocks';

@Component({
  selector: 'app-notifications-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    ClickOutsideDirective,
    TruncateTextPipe,
  ],
  templateUrl: './notifications-dropdown.component.html',
  styleUrl: './notifications-dropdown.component.scss',
})
export class NotificationsDropdownComponent {
  @Input({ required: true }) clickedLi!: string;
  faBell = faBell;
  profile = profile;
  isNotificationOpened: boolean = false;

  notifications = notifications;

  toggleNotification(): void {
    this.isNotificationOpened = !this.isNotificationOpened;
  }

  clickedNotificationOutside(): void {
    this.isNotificationOpened = false;
  }
}
