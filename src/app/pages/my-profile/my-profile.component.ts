import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../core/authentication/auth.service';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { User } from '@angular/fire/auth';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, ProfileInfoComponent, ModalComponent],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
})
export class MyProfileComponent implements OnInit {
  private authService = inject(AuthService);

  user: User | null = null;

  ngOnInit(): void {
    this.authService.user$.subscribe((data: User | null) => {
      this.user = data;
      console.log(this.user);
    });
  }
}
