import { IGottenFriendRequestToClient } from './friendsManagement.model';

export interface INotification {
  photoURL: string | null;
  name: string | null;
  request: IGottenFriendRequestToClient;
}
