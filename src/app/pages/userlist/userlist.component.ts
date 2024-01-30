import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../core/authentication/auth.service';
import { UsersService } from '../../core/services/users.service';
import { IUser } from '../../shared/models/user.model';
import { UserItemComponent } from '../../shared/components/user-item/user-item.component';

@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [UserItemComponent],
  templateUrl: './userlist.component.html',
  styleUrl: './userlist.component.scss',
})
export class UserlistComponent implements OnInit {
  authService = inject(AuthService);
  usersService = inject(UsersService);

  users: IUser[] = [];
  loadingUsers!: boolean;
  ngOnInit(): void {
    this.loadingUsers = true;
    this.usersService.getAllUsers().then((res) => {
      console.log('users', res);
      this.users = res;
      this.loadingUsers = false;
    });
  }
}
