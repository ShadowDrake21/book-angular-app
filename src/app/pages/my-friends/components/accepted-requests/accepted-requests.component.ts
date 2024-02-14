import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { IGottenFriendRequestToClient } from '../../../../shared/models/friendsManagement.model';
import { AcceptedRequestItemComponent } from '../accepted-request-item/accepted-request-item.component';

@Component({
  selector: 'app-accepted-requests',
  standalone: true,
  imports: [CommonModule, AcceptedRequestItemComponent],
  templateUrl: './accepted-requests.component.html',
  styleUrl: './accepted-requests.component.scss',
})
export class AcceptedRequestsComponent implements OnInit, OnChanges {
  @Input() allAcceptedRequests: IGottenFriendRequestToClient[] = [];
  loadingRequests!: boolean;

  ngOnInit(): void {
    this.loadingRequests = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadingRequests = true;
    if (changes['allAcceptedRequests']) {
      this.allAcceptedRequests = changes['allAcceptedRequests'].currentValue;
      console.log(
        'all accepted requests after changes: ',
        this.allAcceptedRequests
      );
      this.loadingRequests = false;
    }
  }
}
