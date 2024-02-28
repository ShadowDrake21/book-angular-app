import { CommonModule } from '@angular/common';
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
import { FriendsManagementService } from '../../../../core/services/friends-management.service';
import { User } from '@angular/fire/auth';
import { ISentFriendRequestToClient } from '../../../../shared/models/friendsManagement.model';
import { SentRequestItemComponent } from '../sent-request-item/sent-request-item.component';

@Component({
  selector: 'app-sent-requests',
  standalone: true,
  imports: [CommonModule, SentRequestItemComponent],
  templateUrl: './sent-requests.component.html',
  styleUrl: './sent-requests.component.scss',
})
export class SentRequestsComponent implements OnInit, OnChanges {
  private friendsManagementService = inject(FriendsManagementService);
  @Input() allSentRequests: ISentFriendRequestToClient[] = [];
  @Input() user!: User | null;
  @Output() isUpdate = new EventEmitter<boolean>();
  loadingRequests!: boolean;

  ngOnInit(): void {
    this.loadingRequests = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadingRequests = true;
    if (changes['allSentRequests']) {
      this.allSentRequests = changes['allSentRequests'].currentValue;
      this.loadingRequests = false;
    }
  }

  async requestDelete(deleteEmail: string) {
    if (!this.user?.email) return;
    await this.friendsManagementService.deleteSentFriendRequest(
      this.user?.email,
      deleteEmail,
      'sentRequests'
    );
    await this.friendsManagementService.deleteGottenFriendRequest(
      this.user?.email,
      deleteEmail,
      'gottenRequests'
    );
    this.isUpdate.emit(true);
  }
}
