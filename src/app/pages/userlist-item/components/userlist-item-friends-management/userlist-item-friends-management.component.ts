import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FriendsManagementService } from '../../../../core/services/friends-management.service';
import { AuthService } from '../../../../core/authentication/auth.service';
import { Subscription } from 'rxjs';
import {
  IGottenFriendRequestToDB,
  ISentFriendRequestToDB,
} from '../../../../shared/models/friendsManagement.model';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-userlist-item-friends-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './userlist-item-friends-management.component.html',
  styleUrl: './userlist-item-friends-management.component.scss',
})
export class UserlistItemFriendsManagementComponent
  implements OnInit, OnDestroy
{
  private authService = inject(AuthService);
  private friendsManagementService = inject(FriendsManagementService);

  @Input({ required: true }) userEmail: string | null = '';

  private subscription!: Subscription;
  ourEmail: string = '';

  isFriendRequestSent: boolean = false;
  isFriendRequestGotten: boolean = false;
  isFriendRequestAccepted: boolean = false;
  isFriendRequestRejected: boolean = false;

  loadingOurEmail?: boolean;
  loadingIsFriendRequest?: boolean;

  ngOnInit(): void {
    this.loadingOurEmail = true;
    this.loadingIsFriendRequest = true;
    this.subscription = this.authService.user$.subscribe(async (data) => {
      if (!data?.email || !this.userEmail) return;
      this.ourEmail = data?.email;
      this.loadingOurEmail = false;
      await this.getAllMarks().then(
        () => (this.loadingIsFriendRequest = false)
      );
    });
  }

  async getAllMarks() {
    if (!this.userEmail) return;
    await this.friendsManagementService
      .checkUserFriendRequest(
        'sentRequests',
        this.ourEmail,
        this.userEmail,
        'recipientEmail'
      )
      .then((res: boolean) => {
        this.isFriendRequestSent = res;
      });
    await this.friendsManagementService
      .checkUserFriendRequest(
        'gottenRequests',
        this.ourEmail,
        this.userEmail,
        'senderEmail'
      )
      .then((res: boolean) => {
        this.isFriendRequestGotten = res;
      });
    await this.friendsManagementService
      .checkUserFriendRequest(
        'accepted',
        this.ourEmail,
        this.userEmail,
        'senderEmail'
      )
      .then((res: boolean) => {
        this.isFriendRequestAccepted = res;
      });
    await this.friendsManagementService
      .checkUserFriendRequest(
        'rejected',
        this.ourEmail,
        this.userEmail,
        'senderEmail'
      )
      .then((res: boolean) => {
        this.isFriendRequestRejected = res;
      });
  }

  async onFriendsRequest() {
    if (!this.userEmail) return;
    this.isFriendRequestSent = !this.isFriendRequestSent;
    if (this.isFriendRequestSent) {
      let date = Timestamp.now();
      await this.friendsManagementService.sendFriendRequest(
        'sentRequests',
        this.ourEmail,
        this.userEmail,
        {
          recipientEmail: this.userEmail,
          date: date,
        } as ISentFriendRequestToDB
      );
      await this.friendsManagementService.sendFriendRequest(
        'gottenRequests',
        this.userEmail,
        this.ourEmail,
        {
          senderEmail: this.ourEmail,
          date: date,
        } as IGottenFriendRequestToDB
      );
    } else {
      await this.friendsManagementService.deleteSentFriendRequest(
        this.ourEmail,
        this.userEmail,
        'sentRequests'
      );
      await this.friendsManagementService.deleteGottenFriendRequest(
        this.ourEmail,
        this.userEmail,
        'gottenRequests'
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
