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
import { Auth } from '@angular/fire/auth';
import { PaginationLiteService } from '../../core/services/pagination-lite.service';

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
  providers: [PaginationLiteService],
  templateUrl: './userlist.component.html',
  styleUrl: './userlist.component.scss',
})
export class UserlistComponent implements OnInit {
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  protected paginationLiteService = inject(PaginationLiteService);

  searchUserForm = new FormGroup({
    userEmail: new FormControl('', [Validators.required, Validators.email]),
  });

  currentUserEmail!: string | null | undefined;
  users: IUser[] = [];
  loadingUsers!: boolean;

  isAfterSearch: boolean = false;

  searchTitle: string | null | undefined = '';

  ngOnInit(): void {
    this.loadAllUsers();
    this.authService.user$.subscribe((data) => {
      this.currentUserEmail = data?.email;
    });
  }

  loadAllUsers() {
    this.loadingUsers = true;
    this.isAfterSearch = false;
    this.searchTitle = '';
    this.usersService
      .getAllUsers()
      .then((res) => {
        this.users = res.filter(
          (user: IUser) => user.email !== this.currentUserEmail
        );
        this.loadingUsers = false;
      })
      .finally(() => {
        this.paginationLiteService.itemsPerPage = 8;
        this.paginationUsage();
      });
  }

  onSearch() {
    if (!this.searchUserForm.value.userEmail) return;
    this.loadingUsers = true;
    this.usersService
      .getUserByEmail(this.searchUserForm.value.userEmail)
      .then((res) => {
        this.users = res.filter(
          (user: IUser) => user.email !== this.currentUserEmail
        );
        this.isAfterSearch = true;
        this.paginationUsage();
        this.searchTitle = this.searchUserForm.value.userEmail;
        this.loadingUsers = false;
        this.searchUserForm.reset();
      });
  }

  paginationUsage() {
    this.paginationLiteService.currentPage = 1;
    this.paginationLiteService.elements = this.users;
    this.paginationLiteService.updateVisibleElements();
  }
}
