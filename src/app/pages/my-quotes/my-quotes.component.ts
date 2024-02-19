import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { QuotesListComponent } from './components/quotes-list/quotes-list.component';
import { QuotesService } from '../../core/services/quotes.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../shared/components/UI/button/button.component';

@Component({
  selector: 'app-my-quotes',
  standalone: true,
  imports: [
    CommonModule,
    QuotesListComponent,
    ReactiveFormsModule,
    ButtonComponent,
  ],
  templateUrl: './my-quotes.component.html',
  styleUrl: './my-quotes.component.scss',
})
export class MyQuotesComponent {
  private quotesService = inject(QuotesService);

  quoteForm = new FormGroup({
    text: new FormControl('', Validators.required),
    author: new FormControl('', Validators.required),
  });

  onQuoteSubmit() {
    console.log(this.quoteForm.value);
  }
}
