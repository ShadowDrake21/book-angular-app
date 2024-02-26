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

declare let Email: any;

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

  onSubmit() {
    console.log('form', Email);

    Email.send({
      SecureToken: 'ea79a6eb-98aa-4ada-badc-c17ec70bd0ff',
      To: 'shadowdrake21.commercial@gmail.com',
      From: 'shadowdrake21.commercial@gmail.com',
      Subject: 'From Contact Me',
      Body: `
      <i>This is sent as a request to contact with my from Contact Me page.</i> <br/> <b>Name: </b>${this.contactForm.value.name} <br /> <b>Email: </b>${this.contactForm.value.email}<br /> <b>Subject: </b>From Contact Me<br /> <b>Message:</b> <br /> ${this.contactForm.value.message} <br><br> <b>~End of Message.~</b> `,
    }).then((message: string) => {
      alert(message);
      this.contactForm.reset();
    });
  }
}
