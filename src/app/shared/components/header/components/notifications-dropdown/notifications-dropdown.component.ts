import { Component, Input, OnInit, inject } from '@angular/core';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { profile } from '../../content/header.content';
import { TruncateTextPipe } from '../../../../pipes/truncate-text.pipe';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { RouterModule } from '@angular/router';
import { NotificationsService } from '../../../../../core/services/notifications.service';
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
  private notificationsService = inject(NotificationsService);

  @Input({ required: true }) clickedLi!: string;

  faBell = faBell;
  profile = profile;
  isNotificationOpened: boolean = false;

  loadingNotifications!: boolean;
  notifications: INotification[] = [];

  async ngOnInit(): Promise<void> {
    this.loadingNotifications = true;
    this.notifications = await this.notificationsService.loadingNotifications();

    this.notifications = this.notifications.slice(
      this.notifications.length - 2,
      this.notifications.length
    );
    this.loadingNotifications = false;
  }

  toggleNotification(): void {
    this.isNotificationOpened = !this.isNotificationOpened;
  }

  clickedNotificationOutside(): void {
    this.isNotificationOpened = false;
  }
}
