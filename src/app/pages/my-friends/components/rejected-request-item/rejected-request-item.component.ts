import { Component, Input } from '@angular/core';
import { IGottenFriendRequestToClient } from '../../../../shared/models/friendsManagement.model';
import { CommonModule } from '@angular/common';
import { TruncateTextPipe } from '../../../../shared/pipes/truncate-text.pipe';

@Component({
  selector: 'app-rejected-request-item',
  standalone: true,
  imports: [CommonModule, TruncateTextPipe],
  templateUrl: './rejected-request-item.component.html',
  styleUrl: './rejected-request-item.component.scss',
})
export class RejectedRequestItemComponent {
  @Input() request!: IGottenFriendRequestToClient;
}
