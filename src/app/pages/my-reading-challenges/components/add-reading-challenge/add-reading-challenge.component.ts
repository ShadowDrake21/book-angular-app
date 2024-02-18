import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { InputComponent } from '../../../../shared/components/UI/input/input.component';
import { ButtonComponent } from '../../../../shared/components/UI/button/button.component';
import {
  FormControl,
  FormControlName,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TruncateTextPipe } from '../../../../shared/pipes/truncate-text.pipe';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { AuthService } from '../../../../core/authentication/auth.service';
import { EMPTY, Observable, Subject, catchError, takeUntil } from 'rxjs';
import { User } from '@angular/fire/auth';
import { StorageService } from '../../../../core/services/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MEDIA_STORAGE_PATH } from '../../../../core/constants/storage.constants';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from '../../../../../environments/environment';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { ChallengesService } from '../../../../core/services/challenges.service';

@Component({
  selector: 'app-add-reading-challenge',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    TruncateTextPipe,
    MatProgressBarModule,
  ],
  templateUrl: './add-reading-challenge.component.html',
  styleUrl: './add-reading-challenge.component.scss',
})
export class AddReadingChallengeComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private storageService = inject(StorageService);
  private snackBar = inject(MatSnackBar);
  private challengesService = inject(ChallengesService);

  @Output() isNewChallenge = new EventEmitter<boolean>();

  addChallengeForm = new FormGroup({
    title: new FormControl('', [
      Validators.minLength(4),
      Validators.maxLength(40),
    ]),
    count: new FormControl(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(9999),
    ]),
    image: new FormControl('', Validators.required),
  });

  user!: User | null;
  destroy$: Subject<null> = new Subject();
  uploadProgress$!: Observable<number | undefined>;

  image!: File | undefined;
  submitted!: boolean;

  ngOnInit(): void {
    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: User | null) => (this.user = user));
  }

  filesHandler(event: Event | null) {
    const inputElement = event?.target as HTMLInputElement;
    this.image = inputElement?.files?.[0];
    console.log(this.addChallengeForm.value);
    this.previewPhoto();
  }

  previewPhoto() {
    if (this.image) {
      const fileReader = new FileReader();
      const preview = document.getElementById('file-preview');

      fileReader.onload = (event) => {
        preview?.setAttribute('src', event.target?.result as string);
      };
      fileReader.readAsDataURL(this.image);
    }
  }

  onSubmit() {
    this.isNewChallenge.emit(false);
    console.log(this.addChallengeForm.value);
    this.uploadImage();
  }

  uploadImage() {
    if (!this.image) return;
    this.submitted = true;
    const mediaFolderPath = `${MEDIA_STORAGE_PATH}/${this.user?.email}/challenges/`;

    const { downloadUrl$, uploadProgress$ } =
      this.storageService.uploadFileAndGetMetadata(mediaFolderPath, this.image);

    this.uploadProgress$ = uploadProgress$;

    downloadUrl$
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          this.snackBar.open(`${error.message}`, 'Close', { duration: 4000 });
          return EMPTY;
        })
      )
      .subscribe((downloadUrl) => {
        if (
          !this.user?.email ||
          !this.addChallengeForm.value.title ||
          !this.addChallengeForm.value.count
        )
          return;
        this.submitted = false;
        this.challengesService
          .addNewChallenge(this.user?.email, 'activeChallenges', {
            id: 'challenge' + Math.random().toString(16).slice(2),
            title: this.addChallengeForm.value.title,
            total: parseInt(this.addChallengeForm.value.count),
            read: 0,
            image: downloadUrl,
          })
          .then(() => {
            this.isNewChallenge.emit(true);
            this.addChallengeForm.reset();
            this.image = undefined;
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
  }
}
