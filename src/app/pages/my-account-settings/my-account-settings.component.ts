import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../core/authentication/auth.service';
import { ProfileInfoComponent } from '../my-profile/components/profile-info/profile-info.component';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { IError } from '../../shared/models/error.model';
import { IItemResult } from '../../shared/models/general.model';
import { ButtonComponent } from '../../shared/components/UI/button/button.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsersService } from '../../core/services/users.service';
import { IUser } from '../../shared/models/user.model';

@Component({
  selector: 'app-my-account-settings',
  standalone: true,
  imports: [
    CommonModule,
    ProfileInfoComponent,
    ButtonComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './my-account-settings.component.html',
  styleUrl: './my-account-settings.component.scss',
})
export class MyAccountSettingsComponent implements OnInit {
  private authService = inject(AuthService);
  private usersService = inject(UsersService);
  private router = inject(Router);

  phoneForm = new FormGroup({
    phone: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(15),
    ]),
  });

  loadingUser!: boolean;
  user: User | null = null;

  phone: string | null = null;
  isChangePhone!: boolean;

  deleteMessage!: string;
  verificationMessage!: IItemResult | null;

  ngOnInit(): void {
    this.loadingUser = true;

    this.authService.user$.subscribe((data: User | null) => {
      this.user = data;
      this.loadingUser = false;
      this.getPhone();
      if (this.phone) this.phoneForm.setValue({ phone: this.phone });
    });
  }

  getPhone() {
    this.phone = localStorage.getItem('phone');
  }

  changePhone(value: boolean) {
    this.isChangePhone = value;
  }

  onSubmit() {
    const formPhone = this.phoneForm.value.phone;
    if (!formPhone || formPhone === this.phone) return;
    localStorage.setItem('phone', formPhone);
    this.phone = formPhone;
    this.isChangePhone = false;
  }

  sendVerification() {
    this.authService
      .sendEmailVerification()
      .then(() => {
        this.verificationMessage = {
          isSuccessfull: true,
          message: 'Email verification was delived!',
        };
        setTimeout(() => {
          this.verificationMessage = null;
        }, 3000);
      })
      .catch((error: any) => {
        this.verificationMessage = {
          isSuccessfull: false,
          message: error.message,
        };
      });
  }

  signout() {
    this.authService
      .logout()
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async deleteProfile() {
    if (this.user?.email) {
      const userDB: IUser = (
        await this.authService.retrieveUserData(this.user?.email)
      )[0];
      await this.usersService.deleteUser(userDB.id);
      this.deleteMessage = await this.authService.deleteAccount();
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 5000);
    }
  }
}
