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
import { RejectedRequestItemComponent } from '../rejected-request-item/rejected-request-item.component';

@Component({
  selector: 'app-rejected-requests',
  standalone: true,
  imports: [CommonModule, RejectedRequestItemComponent],
  templateUrl: './rejected-requests.component.html',
  styleUrl: './rejected-requests.component.scss',
})
export class RejectedRequestsComponent implements OnInit, OnChanges {
  @Input() allRejectedRequests: IGottenFriendRequestToClient[] = [];
  loadingRequests!: boolean;

  ngOnInit(): void {
    this.loadingRequests = true;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.loadingRequests = true;
    if (changes['allRejectedRequests']) {
      this.allRejectedRequests = changes['allRejectedRequests'].currentValue;
      console.log(
        'all rejected requests after changes: ',
        this.allRejectedRequests
      );
      this.loadingRequests = false;
    }
  }
}
