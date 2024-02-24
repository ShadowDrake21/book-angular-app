import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UsersService } from '../../core/services/users.service';
import { FriendsManagementService } from '../../core/services/friends-management.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent {
  private usersService = inject(UsersService);
  private friendsManagementService = inject(FriendsManagementService);
}
