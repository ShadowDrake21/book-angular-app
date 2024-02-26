import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../shared/components/UI/button/button.component';
import { InputComponent } from '../../shared/components/UI/input/input.component';
import { TextareaComponent } from '../../shared/components/UI/textarea/textarea.component';

@Component({
  selector: 'app-contact-me',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    TextareaComponent,
    ButtonComponent,
  ],
  templateUrl: './contact-me.component.html',
  styleUrl: './contact-me.component.scss',
})
export class ContactMeComponent {
  contactForm = new FormGroup({
    email: new FormControl('', Validators.email),
    name: new FormControl(''),
    message: new FormControl('', Validators.minLength(10)),
  });

  myEmail: string = 'dimka670020040@gmail.com';

  onSubmit() {
    console.log('form', this.contactForm);
  }
}
