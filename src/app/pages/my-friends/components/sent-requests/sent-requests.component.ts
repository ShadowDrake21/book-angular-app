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

@Component({
  selector: 'app-sent-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sent-requests.component.html',
  styleUrl: './sent-requests.component.scss',
})
export class SentRequestsComponent implements OnInit, OnChanges {
  @Input() allSentRequests: ISentFriendRequestToClient[] = [];
  @Input() user!: User | null;
  loadingRequests!: boolean;

  ngOnInit(): void {
    this.loadingRequests = true;
    console.log('all sent requests: ', this.allSentRequests);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadingRequests = true;
    if (changes['allSentRequests']) {
      this.allSentRequests = changes['allSentRequests'].currentValue;
      console.log('all sent requests after changes: ', this.allSentRequests);
      this.loadingRequests = false;
    }
  }
}
