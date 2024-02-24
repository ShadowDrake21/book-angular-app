import { Component, Input, OnInit, inject } from '@angular/core';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { profile } from '../../content/header.content';
import { TruncateTextPipe } from '../../../../pipes/truncate-text.pipe';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { notifications } from '../../mocks/header.mocks';
import { UsersService } from '../../../../../core/services/users.service';
import { FriendsManagementService } from '../../../../../core/services/friends-management.service';
import { RouterModule } from '@angular/router';
import { NotificationsService } from '../../../../../core/services/notifications.service';
import { User } from '@angular/fire/auth';
import { INotification } from '../../../../models/notification.model';

@Component({
  selector: 'app-notifications-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    ClickOutsideDirective,
    TruncateTextPipe,
    RouterModule,
  ],
  templateUrl: './notifications-dropdown.component.html',
  styleUrl: './notifications-dropdown.component.scss',
})
export class NotificationsDropdownComponent implements OnInit {
  private notificationService = inject(NotificationsService);

  @Input({ required: true }) userEmail: string = '';
  @Input({ required: true }) clickedLi!: string;

  faBell = faBell;
  profile = profile;
  isNotificationOpened: boolean = false;

  loadingNotifications!: boolean;
  notifications: INotification[] = [];

  async ngOnInit(): Promise<void> {
    this.loadingNotifications = true;
    this.notifications = await this.notificationService.loadingNotifications();

    this.notifications = this.notifications.slice(
      this.notifications.length - 2,
      this.notifications.length
    );
    console.log('this loading', this.notifications);
    this.loadingNotifications = false;
  }

  toggleNotification(): void {
    this.isNotificationOpened = !this.isNotificationOpened;
  }

  clickedNotificationOutside(): void {
    this.isNotificationOpened = false;
  }
}
