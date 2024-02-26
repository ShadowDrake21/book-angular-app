import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../shared/components/UI/input/input.component';
import { ButtonComponent } from '../../shared/components/UI/button/button.component';

@Component({
  selector: 'app-about-developer',
  standalone: true,
  imports: [],
  templateUrl: './about-developer.component.html',
  styleUrl: './about-developer.component.scss',
})
export class AboutDeveloperComponent {}
