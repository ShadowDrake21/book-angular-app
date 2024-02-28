import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { User, getAuth } from '@angular/fire/auth';
import { TruncateTextPipe } from '../../../../shared/pipes/truncate-text.pipe';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../../../shared/components/UI/input/input.component';
import { ButtonComponent } from '../../../../shared/components/UI/button/button.component';
import { AuthService } from '../../../../core/authentication/auth.service';
import { IUser } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [
    CommonModule,
    TruncateTextPipe,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.scss',
})
export class ProfileInfoComponent implements OnChanges {
  private authService = inject(AuthService);

  @Input() user!: User | null;
  @Input() isSettings: boolean = false;

  editProfileForm = new FormGroup({
    name: new FormControl('', Validators.maxLength(40)),
    image: new FormControl('', Validators.required),
  });

  isEdit!: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      this.user = changes['user'].currentValue;
      if (this.user?.displayName) {
        this.editProfileForm.patchValue({
          name: this.user.displayName,
          image: this.user.photoURL,
        });
      }
    }
  }

  onEdit() {
    const auth = getAuth();
    if (auth.currentUser) {
      const displayName = this.editProfileForm.value.name;
      const photoURL = this.editProfileForm.value.image;
      this.authService
        .updateProfile(auth.currentUser, {
          displayName,
          photoURL,
        })
        .then(async () => {
          if (this.user?.email) {
            await this.authService
              .retrieveUserData(this.user?.email)
              .then((user) => {
                const userInDB: IUser = user[0];
                this.authService.updateUserData(userInDB.id, {
                  displayName,
                  photoURL,
                });
              });
          }
        });
    }
    this.isEdit = false;
  }
}
