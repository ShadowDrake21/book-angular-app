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
import { RouterModule } from '@angular/router';
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
export class RegistrationComponent implements OnInit {
  private authService = inject(AuthService);

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

  ngOnInit(): void {}

  async onSubmit() {
    if (
      !this.registrationForm.value.email ||
      !this.registrationForm.value.password ||
      !this.registrationForm.value.name
    )
      return;
    console.log(this.registrationForm.value);
    await this.authService.register(
      this.registrationForm.value.email,
      this.registrationForm.value.password,
      this.registrationForm.value.name
    );
  }
}
