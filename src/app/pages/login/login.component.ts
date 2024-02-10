import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { GoogleBtnComponent } from '../../shared/components/UI/google-btn/google-btn.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    RouterModule,
    GoogleBtnComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  protected authService = inject(AuthService);
  private router = inject(Router);
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

  authSubscription!: Subscription;
  isInSystem: boolean = false;

  ngOnInit(): void {
    if (localStorage.getItem('user') !== 'null') {
      this.checkAuthState();
    }
  }

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
        this.router.navigate(['/home']);
        this.checkAuthState();
      })
      .catch((error) => {
        this.failedLoginSet = {
          isFailed: true,
          message: error.message,
        };
      });
  }

  onLogout() {
    this.authService
      .logout()
      .then(() => {
        this.router.navigate(['/']);
        this.checkAuthState();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  checkAuthState() {
    this.authSubscription = this.authService.authState$.subscribe((res) => {
      this.isInSystem = !!(res && res.uid);
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) this.authSubscription.unsubscribe();
  }
}
