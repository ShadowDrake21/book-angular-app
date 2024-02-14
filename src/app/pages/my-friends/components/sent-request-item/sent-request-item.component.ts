import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ISentFriendRequestToClient } from '../../../../shared/models/friendsManagement.model';
import { TruncateTextPipe } from '../../../../shared/pipes/truncate-text.pipe';

@Component({
  selector: 'app-sent-request-item',
  standalone: true,
  imports: [CommonModule, TruncateTextPipe],
  templateUrl: './sent-request-item.component.html',
  styleUrl: './sent-request-item.component.scss',
})
export class SentRequestItemComponent {
  @Input() request!: ISentFriendRequestToClient;
  @Output() requestDelete = new EventEmitter<string>();
}
