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

  onSubmit() {
    console.log(this.loginForm.value);
  }
}
