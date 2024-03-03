import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { User } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';
import { IGottenFriendRequestToClient } from '../../../../shared/models/friendsManagement.model';
import { PaginationLiteService } from '../../../../core/services/pagination-lite.service';
import { FriendsManagementService } from '../../../../core/services/friends-management.service';
import { IUser } from '../../../../shared/models/user.model';
import { UsersService } from '../../../../core/services/users.service';

@Component({
  selector: 'app-profile-friends',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [PaginationLiteService],
  templateUrl: './profile-friends.component.html',
  styleUrl: './profile-friends.component.scss',
})
export class ProfileFriendsComponent implements OnInit {
  private friendsManagementService = inject(FriendsManagementService);
  private usersService = inject(UsersService);
  protected paginationLiteService = inject(PaginationLiteService);

  @Input() user!: User | null;

  loadingFriends!: boolean;
  allFriendsRequests: IGottenFriendRequestToClient[] = [];
  allFriends: IUser[] = [];

  async ngOnInit(): Promise<void> {
    this.loadingFriends = true;
    if (this.user?.email) {
      this.allFriendsRequests =
        (await this.friendsManagementService.getAllGottenFriendRequests(
          this.user?.email,
          'accepted'
        )) as IGottenFriendRequestToClient[];

      await Promise.all(
        this.allFriendsRequests.map(async (request) => {
          const res = await this.usersService.getUserByEmail(
            request.senderEmail
          );
          this.allFriends.push(res[0]);
        })
      );
    }

    this.paginationLiteService.elements = this.allFriends;
    this.paginationLiteService.updateVisibleElements();
    this.loadingFriends = false;
    console.log(
      this.paginationLiteService.currentPage,
      this.paginationLiteService.numPages()
    );
  }
}
