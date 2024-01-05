import { Component } from '@angular/core';
import { InputComponent } from '../../shared/components/UI/input/input.component';
import { ButtonComponent } from '../../shared/components/UI/button/button.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/authentication/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', Validators.email),
    password: new FormControl('', [
      Validators.minLength(6),
      Validators.maxLength(20),
    ]),
  });
  failedLoginSet = {
    isFailed: false,
    message: '',
  };

  constructor(private authService: AuthService, private router: Router) {}
  onSubmit() {
    if (!this.loginForm.value.email || !this.loginForm.value.password) {
      return;
    }

    if (this.failedLoginSet.isFailed) {
      this.failedLoginSet.isFailed = false;
      this.failedLoginSet.message = '';
    }

    this.authService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .then(() => {
        console.log('User is login');
        this.router.navigate(['home']);
        setTimeout(() => this.isLogin(), 5000);
      })
      .catch((error) => {
        this.failedLoginSet = {
          isFailed: true,
          message: error.message,
        };
      });
  }

  isLogin() {
    this.authService.authState$.subscribe((res) => {
      if (res && res.uid) {
        console.log('user is logged in');
      } else {
        console.log('user is not logged in');
      }
    });
  }
}
