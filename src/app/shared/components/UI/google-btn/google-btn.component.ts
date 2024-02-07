import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/authentication/auth.service';

@Component({
  selector: 'app-google-btn',
  standalone: true,
  imports: [],
  templateUrl: './google-btn.component.html',
  styleUrl: './google-btn.component.scss',
})
export class GoogleBtnComponent {
  protected authService = inject(AuthService);
}
