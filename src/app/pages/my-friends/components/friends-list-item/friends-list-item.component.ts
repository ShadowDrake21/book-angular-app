import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IUser } from '../../../../shared/models/user.model';
import { TruncateTextPipe } from '../../../../shared/pipes/truncate-text.pipe';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-friends-list-item',
  standalone: true,
  imports: [CommonModule, TruncateTextPipe, RouterModule],
  templateUrl: './friends-list-item.component.html',
  styleUrl: './friends-list-item.component.scss',
})
export class FriendsListItemComponent {
  @Input() friend!: IUser;
}
