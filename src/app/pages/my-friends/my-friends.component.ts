import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../core/authentication/auth.service';
import { User } from '@angular/fire/auth';
import { FriendsManagementService } from '../../core/services/friends-management.service';
import { IGottenFriendRequestToClient } from '../../shared/models/friendsManagement.model';
import { InboxRequestsComponent } from './components/inbox-requests/inbox-requests.component';

@Component({
  selector: 'app-my-friends',
  standalone: true,
  imports: [CommonModule, MatTabsModule, InboxRequestsComponent],
  templateUrl: './my-friends.component.html',
  styleUrl: './my-friends.component.scss',
})
export class MyFriendsComponent implements OnInit {
  private authService = inject(AuthService);
  private friendsManagementService = inject(FriendsManagementService);

  loadingUser!: boolean;
  user: User | null = null;

  selectedTab!: number;
  allGottenRequests: IGottenFriendRequestToClient[] = [];

  ngOnInit(): void {
    this.loadingUser = true;
    this.authService.user$.subscribe((data: User | null) => {
      this.user = data;
      this.loadingUser = false;
    });
  }

  async selectedTabChange(event: MatTabChangeEvent) {
    if (!this.user?.email) return;
    this.selectedTab = event.index;
    if (event.index === 1) {
      this.allGottenRequests =
        (await this.friendsManagementService.getAllGottenFriendRequests(
          this.user?.email
        )) as IGottenFriendRequestToClient[];
    }
  }
}
