import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { IUser } from '../../../../shared/models/user.model';
import { FriendsListItemComponent } from '../friends-list-item/friends-list-item.component';
import { FloatingMessageComponent } from '../../../../shared/components/floating-message/floating-message.component';

@Component({
  selector: 'app-friends-list',
  standalone: true,
  imports: [CommonModule, FriendsListItemComponent, FloatingMessageComponent],
  templateUrl: './friends-list.component.html',
  styleUrl: './friends-list.component.scss',
})
export class FriendsListComponent implements OnInit, OnChanges {
  @Input() friends: IUser[] = [];

  loadingRequests!: boolean;
  loadingFriends: boolean = true;

  async ngOnInit(): Promise<void> {
    this.loadingFriends = true;
    await new Promise((resolve) => setTimeout(resolve, 2500));
    this.loadingFriends = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['friends']) {
      this.friends = changes['friends'].currentValue;
    }
  }
}
