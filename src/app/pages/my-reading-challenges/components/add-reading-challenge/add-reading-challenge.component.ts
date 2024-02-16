import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { InputComponent } from '../../../../shared/components/UI/input/input.component';
import { ButtonComponent } from '../../../../shared/components/UI/button/button.component';
import {
  FormControl,
  FormControlName,
  FormGroup,
  ReactiveFormsModule,
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
  private router = inject(Router);

  addChallengeForm = new FormGroup({
    title: new FormControl(''),
    count: new FormControl(''),
    image: new FormControl(''),
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
        this.submitted = false;
        this.router.navigate([`/${downloadUrl}`]);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
  }
}
