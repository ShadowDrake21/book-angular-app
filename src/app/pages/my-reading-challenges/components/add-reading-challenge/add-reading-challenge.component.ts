import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InputComponent } from '../../../../shared/components/UI/input/input.component';
import { ButtonComponent } from '../../../../shared/components/UI/button/button.component';
import {
  FormControl,
  FormControlName,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { TruncateTextPipe } from '../../../../shared/pipes/truncate-text.pipe';

@Component({
  selector: 'app-add-reading-challenge',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    TruncateTextPipe,
  ],
  templateUrl: './add-reading-challenge.component.html',
  styleUrl: './add-reading-challenge.component.scss',
})
export class AddReadingChallengeComponent implements OnInit {
  addChallengeForm = new FormGroup({
    title: new FormControl(''),
    count: new FormControl(''),
    image: new FormControl(null),
  });

  image!: File | undefined;

  ngOnInit(): void {}

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
}
