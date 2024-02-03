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
  authService = inject(AuthService);
  friendsManagementService = inject(FriendsManagementService);

  @Input({ required: true }) userEmail: string | null = '';

  private subscription!: Subscription;
  ourEmail: string = '';
  isFriendRequestSent: boolean = false;
  loadingOurEmail?: boolean;
  loadingIsFriendRequestSent?: boolean;

  // zrobić akceptację, uchylenie zapytu + stronę z główną informacją
  ngOnInit(): void {
    this.loadingOurEmail = true;
    this.loadingIsFriendRequestSent = true;
    this.subscription = this.authService.user$.subscribe(async (data) => {
      if (!data?.email || !this.userEmail) return;
      this.ourEmail = data?.email;
      this.loadingOurEmail = false;
      console.log('emails: ', this.userEmail, this.ourEmail);
      console.log('this.loading our email');

      await this.friendsManagementService
        .checkUserSentOrGotFriendRequest(
          'sentRequests',
          this.ourEmail,
          this.userEmail,
          'recipientEmail'
        )
        .then((res: boolean) => {
          this.isFriendRequestSent = res;
          this.loadingIsFriendRequestSent = false;
        });
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
        this.userEmail
      );
      await this.friendsManagementService.deleteGottenFriendRequest(
        this.ourEmail,
        this.userEmail
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
