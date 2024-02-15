import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../core/authentication/auth.service';
import { User } from '@angular/fire/auth';
import { FriendsManagementService } from '../../core/services/friends-management.service';
import {
  IGottenFriendRequestToClient,
  ISentFriendRequestToClient,
} from '../../shared/models/friendsManagement.model';
import { InboxRequestsComponent } from './components/inbox-requests/inbox-requests.component';
import { SentRequestsComponent } from './components/sent-requests/sent-requests.component';
import { AcceptedRequestsComponent } from './components/accepted-requests/accepted-requests.component';
import { RejectedRequestsComponent } from './components/rejected-requests/rejected-requests.component';
import { FriendsListComponent } from './components/friends-list/friends-list.component';
import { UsersService } from '../../core/services/users.service';
import { IUser } from '../../shared/models/user.model';

@Component({
  selector: 'app-my-friends',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    FriendsListComponent,
    InboxRequestsComponent,
    SentRequestsComponent,
    AcceptedRequestsComponent,
    RejectedRequestsComponent,
  ],
  templateUrl: './my-friends.component.html',
  styleUrl: './my-friends.component.scss',
})
export class MyFriendsComponent implements OnInit {
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private friendsManagementService = inject(FriendsManagementService);

  loadingUser!: boolean;
  user: User | null = null;

  selectedTab: number = 0;
  allGottenRequests: IGottenFriendRequestToClient[] = [];
  allSentRequests: ISentFriendRequestToClient[] = [];
  allAcceptedRequests: IGottenFriendRequestToClient[] = [];
  allRejectedRequests: IGottenFriendRequestToClient[] = [];

  friends: IUser[] = [];

  ngOnInit(): void {
    this.loadingUser = true;
    this.authService.user$.subscribe((data: User | null) => {
      this.user = data;
      this.loadingUser = false;
      this.getContentAccepted();
    });
  }

  async selectedTabChange(event: MatTabChangeEvent) {
    this.selectedTab = event.index;
    if (event.index === 0) {
      this.friends = [];
      this.getContentAccepted();
    } else if (event.index === 1) {
      this.getContentInbox();
    } else if (event.index === 2) {
      this.getContentSent();
    } else if (event.index === 3) {
      this.getContentAccepted();
    } else if (event.index === 4) {
      this.getContentRejected();
    }
  }

  async getContentInbox() {
    if (!this.user?.email) return;
    this.allGottenRequests =
      (await this.friendsManagementService.getAllGottenFriendRequests(
        this.user?.email,
        'gottenRequests'
      )) as IGottenFriendRequestToClient[];
  }

  async getContentSent() {
    if (!this.user?.email) return;
    this.allSentRequests =
      (await this.friendsManagementService.getAllSentFriendRequests(
        this.user?.email
      )) as ISentFriendRequestToClient[];
  }

  async getContentAccepted() {
    if (!this.user?.email) return;
    this.allAcceptedRequests =
      (await this.friendsManagementService.getAllGottenFriendRequests(
        this.user?.email,
        'accepted'
      )) as IGottenFriendRequestToClient[];
    this.getAllFriends();
  }

  async getContentRejected() {
    if (!this.user?.email) return;
    this.allRejectedRequests =
      (await this.friendsManagementService.getAllGottenFriendRequests(
        this.user?.email,
        'rejected'
      )) as IGottenFriendRequestToClient[];
  }

  getAllFriends() {
    this.allAcceptedRequests.forEach(async (request) => {
      await this.usersService
        .getUserByEmail(request.senderEmail)
        .then((friend) => {
          this.friends.push(friend[0]);
        });
    });
  }
}
