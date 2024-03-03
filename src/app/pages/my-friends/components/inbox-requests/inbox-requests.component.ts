import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import {
  IGottenFriendRequestToClient,
  IRequestManipulation,
} from '../../../../shared/models/friendsManagement.model';
import { CommonModule } from '@angular/common';
import { FriendsManagementService } from '../../../../core/services/friends-management.service';
import { User } from '@angular/fire/auth';
import { Timestamp } from '@angular/fire/firestore';
import { InboxRequestItemComponent } from '../inbox-request-item/inbox-request-item.component';
import { FloatingMessageComponent } from '../../../../shared/components/floating-message/floating-message.component';

@Component({
  selector: 'app-inbox-requests',
  standalone: true,
  imports: [CommonModule, InboxRequestItemComponent, FloatingMessageComponent],
  templateUrl: './inbox-requests.component.html',
  styleUrl: './inbox-requests.component.scss',
})
export class InboxRequestsComponent implements OnInit, OnChanges {
  private friendsManagementService = inject(FriendsManagementService);
  @Input() allGottenRequests: IGottenFriendRequestToClient[] = [];
  @Input() user!: User | null;
  @Output() isUpdate = new EventEmitter<boolean>();
  loadingRequests!: boolean;
  requestReaction!: IRequestManipulation;

  ngOnInit(): void {
    this.loadingRequests = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadingRequests = true;
    if (changes['allGottenRequests']) {
      this.allGottenRequests = changes['allGottenRequests'].currentValue;
      this.loadingRequests = false;
    }
  }

  async acceptRequest(senderEmail: string) {
    if (!this.user?.email) return;
    await this.friendsManagementService.manipulateFriendRequest(
      'accepted',
      senderEmail,
      this.user?.email,
      { senderEmail: this.user.email, date: Timestamp.now() }
    );
    await this.friendsManagementService.manipulateFriendRequest(
      'accepted',
      this.user?.email,
      senderEmail,
      { senderEmail, date: Timestamp.now() }
    );
    await this.friendsManagementService.deleteGottenFriendRequest(
      senderEmail,
      this.user?.email,
      'gottenRequests'
    );
    await this.friendsManagementService.deleteSentFriendRequest(
      senderEmail,
      this.user?.email,
      'sentRequests'
    );
    this.isUpdate.emit(true);
  }

  async rejectRequest(senderEmail: string) {
    if (!this.user?.email) return;
    await this.friendsManagementService.manipulateFriendRequest(
      'rejected',
      senderEmail,
      this.user?.email,
      { senderEmail: this.user.email, date: Timestamp.now() }
    );
    await this.friendsManagementService.manipulateFriendRequest(
      'rejected',
      this.user?.email,
      senderEmail,
      { senderEmail: senderEmail, date: Timestamp.now() }
    );
    await this.friendsManagementService.deleteGottenFriendRequest(
      senderEmail,
      this.user?.email,
      'gottenRequests'
    );
    await this.friendsManagementService.deleteSentFriendRequest(
      senderEmail,
      this.user?.email,
      'sentRequests'
    );
    this.isUpdate.emit(true);
  }

  async getRequestManipulation(obj: IRequestManipulation) {
    if (obj.actionType === 'accept') {
      await this.acceptRequest(obj.senderEmail);
    } else {
      await this.rejectRequest(obj.senderEmail);
    }
  }
}
