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
import { DatepickerComponent } from '../../shared/components/UI/datepicker/datepicker.component';
import { RouterModule } from '@angular/router';
import {
  RECAPTCHA_SETTINGS,
  RecaptchaFormsModule,
  RecaptchaModule,
  RecaptchaSettings,
} from 'ng-recaptcha';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    DatepickerComponent,
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
    birthday: new FormControl('', Validators.required),
    recaptcha: new FormControl(null, Validators.required),
  });

  ngOnInit(): void {
    setInterval(() => {
      console.log(
        'valid: ',
        this.registrationForm.valid,
        'touched: ',
        this.registrationForm.touched
      );
      console.log(this.registrationForm.value);
    }, 2000);
  }

  onSubmit() {}
}
