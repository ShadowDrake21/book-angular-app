import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/authentication/auth.service';
import { InputComponent } from '../../shared/components/UI/input/input.component';
import { ButtonComponent } from '../../shared/components/UI/button/button.component';
import { Router, RouterModule } from '@angular/router';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    RouterModule,
    RecaptchaFormsModule,
    RecaptchaModule,
  ],

  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  registrationForm = new FormGroup({
    email: new FormControl('', Validators.email),
    name: new FormControl('', Validators.maxLength(40)),
    password: new FormControl('', [
      Validators.minLength(6),
      Validators.maxLength(20),
    ]),
    passwordConfirmation: new FormControl('', [
      Validators.minLength(6),
      Validators.maxLength(20),
    ]),
    recaptcha: new FormControl(null, Validators.required),
  });

  registrationMessage!: string;

  async onSubmit() {
    if (
      !this.registrationForm.value.email ||
      !this.registrationForm.value.password ||
      !this.registrationForm.value.name
    )
      return;
    this.registrationMessage = await this.authService.register(
      this.registrationForm.value.email,
      this.registrationForm.value.password,
      this.registrationForm.value.name
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    this.router.navigate(['/login']);
  }
}
