import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  IGottenFriendRequestToClient,
  IRequestManipulation,
} from '../../../../shared/models/friendsManagement.model';
import { TruncateTextPipe } from '../../../../shared/pipes/truncate-text.pipe';

@Component({
  selector: 'app-inbox-request-item',
  standalone: true,
  imports: [CommonModule, TruncateTextPipe],
  templateUrl: './inbox-request-item.component.html',
  styleUrl: './inbox-request-item.component.scss',
})
export class InboxRequestItemComponent {
  @Input() request!: IGottenFriendRequestToClient;
  @Output() requestReaction = new EventEmitter<IRequestManipulation>();

  acceptRequest(senderEmail: string) {
    this.requestReaction.emit({
      actionType: 'accept',
      senderEmail: senderEmail,
    });
  }

  rejectRequest(senderEmail: string) {
    this.requestReaction.emit({
      actionType: 'reject',
      senderEmail: senderEmail,
    });
  }
}
