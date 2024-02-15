import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IGottenFriendRequestToClient } from '../../../../shared/models/friendsManagement.model';
import { TruncateTextPipe } from '../../../../shared/pipes/truncate-text.pipe';

@Component({
  selector: 'app-accepted-request-item',
  standalone: true,
  imports: [CommonModule, TruncateTextPipe],
  templateUrl: './accepted-request-item.component.html',
  styleUrl: './accepted-request-item.component.scss',
})
export class AcceptedRequestItemComponent {
  @Input() request!: IGottenFriendRequestToClient;
}
