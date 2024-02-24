import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { UsersService } from '../../core/services/users.service';
import { FriendsManagementService } from '../../core/services/friends-management.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { INotification } from '../../shared/models/notification.model';
import { TruncateTextPipe } from '../../shared/pipes/truncate-text.pipe';
import { PaginationLiteService } from '../../core/services/pagination-lite.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, TruncateTextPipe, RouterLink],
  providers: [PaginationLiteService],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent implements OnInit {
  private notificationsService = inject(NotificationsService);
  protected paginationLiteService = inject(PaginationLiteService);

  loadingNotifications!: boolean;
  notifications: INotification[] = [];

  async ngOnInit(): Promise<void> {
    this.loadingNotifications = true;
    this.notifications = await this.notificationsService.loadingNotifications();
    this.paginationLiteService.elements = this.notifications;
    this.paginationLiteService.updateVisibleElements();
    this.loadingNotifications = false;
  }
}
