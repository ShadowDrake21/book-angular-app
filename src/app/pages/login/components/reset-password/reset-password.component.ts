import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../../../shared/components/UI/input/input.component';
import { ButtonComponent } from '../../../../shared/components/UI/button/button.component';
import { AuthService } from '../../../../core/authentication/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  private authService = inject(AuthService);

  resetPassForm = new FormGroup({
    email: new FormControl('', Validators.email),
  });

  resultMessage!: string;

  async onSubmit() {
    if (!this.resetPassForm.value.email) return;
    this.resultMessage = await this.authService.sendPasswordResetEmails(
      this.resetPassForm.value.email
    );
  }
}
