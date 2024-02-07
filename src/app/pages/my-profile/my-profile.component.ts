import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../core/authentication/auth.service';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { User } from '@angular/fire/auth';
import { ModalService } from '../../core/services/modal.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../shared/components/UI/input/input.component';
import { ButtonComponent } from '../../shared/components/UI/button/button.component';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    CommonModule,
    ProfileInfoComponent,
    ModalComponent,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
})
export class MyProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private modalService = inject(ModalService);

  user: User | null = null;

  editProfileForm = new FormGroup({
    name: new FormControl(this.user?.displayName, Validators.maxLength(40)),
    image: new FormControl(this.user?.photoURL, Validators.required),
  });
  ngOnInit(): void {
    this.authService.user$.subscribe((data: User | null) => {
      this.user = data;
      console.log(this.user);
    });
  }

  openEditModal() {
    this.modalService.open('edit-modal');
  }

  onEdit() {
    console.log(this.editProfileForm.value);
  }
}
