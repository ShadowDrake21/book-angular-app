import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { IGottenFriendRequestToClient } from '../../../../shared/models/friendsManagement.model';
import { CommonModule } from '@angular/common';
import { FriendsManagementService } from '../../../../core/services/friends-management.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-inbox-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inbox-requests.component.html',
  styleUrl: './inbox-requests.component.scss',
})
export class InboxRequestsComponent implements OnInit, OnChanges {
  private friendsManagementService = inject(FriendsManagementService);
  @Input() allGottenRequests: IGottenFriendRequestToClient[] = [];
  @Input() user!: User | null;
  loadingRequests!: boolean;

  ngOnInit(): void {
    this.loadingRequests = true;
    console.log('all gotten requests: ', this.allGottenRequests);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadingRequests = true;
    if (changes['allGottenRequests']) {
      this.allGottenRequests = changes['allGottenRequests'].currentValue;
      console.log(
        'all gotten requests after changes: ',
        this.allGottenRequests
      );
      this.loadingRequests = false;
    }
  }

  async acceptRequest(senderEmail: string, time: ) {
    await this.friendsManagementService.acceptFriendRequest('accepted', senderEmail, this.user?.email, )
  }

  rejectRequest(senderEmail: string) {
    console.log('reject request', senderEmail);
  }
}
