import { Injectable, inject } from '@angular/core';
import { UsersService } from './users.service';
import { FriendsManagementService } from './friends-management.service';
import { AuthService } from '../authentication/auth.service';
import { INotification } from '../../shared/models/notification.model';
import { User } from '@angular/fire/auth';
import { IGottenFriendRequestToClient } from '../../shared/models/friendsManagement.model';
import { IUser } from '../../shared/models/user.model';
import { first } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private friendsManagementService = inject(FriendsManagementService);

  user: User | null | undefined = null;

  async loadingNotifications(): Promise<INotification[]> {
    let gottenRequests: IGottenFriendRequestToClient[] = [];
    let notifications: INotification[] = [];

    try {
      const user = await this.authService.user$.pipe(first()).toPromise();
      this.user = user;
      if (this.user?.email)
        gottenRequests =
          await this.friendsManagementService.getAllGottenFriendRequests(
            this.user?.email,
            'gottenRequests'
          );
      if (gottenRequests) {
        await Promise.all(
          gottenRequests.map(async (request: IGottenFriendRequestToClient) => {
            const sender: IUser = (
              (await this.usersService.getUserByEmail(
                request.senderEmail
              )) as IUser[]
            )[0];
            notifications.push({
              photoURL: sender?.photoURL || '/assets/no profile photo.jpg',
              name: sender?.name,
              request: request,
            });
          })
        );
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }

    console.log('notifications: ', notifications);
    return notifications;
  }
}
