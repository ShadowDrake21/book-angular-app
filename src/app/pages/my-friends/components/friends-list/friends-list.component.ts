import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { IGottenFriendRequestToClient } from '../../../../shared/models/friendsManagement.model';
import { IUser } from '../../../../shared/models/user.model';
import { UsersService } from '../../../../core/services/users.service';

@Component({
  selector: 'app-friends-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './friends-list.component.html',
  styleUrl: './friends-list.component.scss',
})
export class FriendsListComponent implements OnInit, OnChanges {
  private usersService = inject(UsersService);
  @Input() allAcceptedRequests: IGottenFriendRequestToClient[] = [];

  loadingRequests!: boolean;
  friends: IUser[] = [];
  loadingFriends!: boolean;

  ngOnInit(): void {
    this.loadingRequests = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadingRequests = true;
    if (changes['allAcceptedRequests']) {
      this.allAcceptedRequests = changes['allAcceptedRequests'].currentValue;
      this.loadingRequests = false;
      this.getAllFriends();
    }
  }

  getAllFriends() {
    this.loadingFriends = true;
    this.allAcceptedRequests.forEach(async (request) => {
      await this.usersService
        .getUserByEmail(request.senderEmail)
        .then((friend) => this.friends.push(friend[0]));
    });
    this.loadingFriends = false;
    console.log('all friends: ', this.friends);
  }
}
