import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../core/authentication/auth.service';
import { UsersService } from '../../core/services/users.service';
import { IUser } from '../../shared/models/user.model';
import { UserItemComponent } from '../../shared/components/user-item/user-item.component';
import { InputComponent } from '../../shared/components/UI/input/input.component';
import { ButtonComponent } from '../../shared/components/UI/button/button.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    UserItemComponent,
  ],
  templateUrl: './userlist.component.html',
  styleUrl: './userlist.component.scss',
})
export class UserlistComponent implements OnInit {
  authService = inject(AuthService);
  usersService = inject(UsersService);

  searchUserForm = new FormGroup({
    userEmail: new FormControl('', [Validators.required, Validators.email]),
  });

  itemsPerPage: number = 8;
  currentPage: number = 1;
  visibleUsers: IUser[] = [];

  users: IUser[] = [];
  loadingUsers!: boolean;

  searchTitle: string | null | undefined = '';

  ngOnInit(): void {
    this.loadingUsers = true;
    this.usersService
      .getAllUsers()
      .then((res) => {
        this.users = res;
        this.loadingUsers = false;
      })
      .finally(() => {
        this.currentPage = 1;
        this.updateVisibleUsers();
      });
    setInterval(() => {
      console.log('form: ', this.searchUserForm);
    }, 1000);
  }

  onSearch() {
    if (!this.searchUserForm.value.userEmail) return;
    this.loadingUsers = true;
    this.usersService
      .getUserByEmail(this.searchUserForm.value.userEmail)
      .then((res) => {
        this.users = res;
        this.currentPage = 1;
        this.updateVisibleUsers();
        this.searchTitle = this.searchUserForm.value.userEmail;
        this.loadingUsers = false;
        this.searchUserForm.reset();
      });
  }

  updateVisibleUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.visibleUsers = this.users.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.numPages()) {
      this.currentPage++;
      this.updateVisibleUsers();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateVisibleUsers();
    }
  }

  numPages(): number {
    return Math.ceil(this.users.length / this.itemsPerPage);
  }
}
