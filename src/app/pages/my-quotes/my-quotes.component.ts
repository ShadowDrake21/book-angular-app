import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { QuotesListComponent } from './components/quotes-list/quotes-list.component';
import { QuotesService } from '../../core/services/quotes.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../shared/components/UI/button/button.component';
import { User } from '@angular/fire/auth';
import { AuthService } from '../../core/authentication/auth.service';
import { IQuote, IQuoteResult } from '../../shared/models/quote.model';

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
export class MyQuotesComponent implements OnInit {
  private authService = inject(AuthService);
  private quotesService = inject(QuotesService);

  loadingUser!: boolean;
  user!: User | null;

  quoteForm = new FormGroup({
    text: new FormControl('', Validators.required),
    author: new FormControl('', Validators.required),
  });
  quoteActionResult!: IQuoteResult | undefined;

  quotes: IQuote[] = [];

  ngOnInit(): void {
    this.loadingUser = true;
    this.authService.user$.subscribe(async (user: User | null) => {
      this.user = user;
      this.loadingUser = false;
      await this.loadUserQuotes();
    });
  }

  async onQuoteSubmit() {
    if (!this.user?.email) return;

    try {
      await this.handleQuoteAction(
        this.quotesService.addNewQuote(this.user.email, this.formQuoteItem())
      );
    } catch (error: any) {
      this.handleQuoteAction(Promise.reject(error));
    }
  }

  async handleQuoteAction(actionPromise: Promise<any>) {
    try {
      await actionPromise;
      this.quoteActionResult = {
        isSuccessfull: true,
        message: 'Quote successfully added!',
      };
      await this.loadUserQuotes();
    } catch (error: any) {
      this.quoteActionResult = {
        isSuccessfull: false,
        message: error.message,
      };
    } finally {
      setTimeout(() => {
        this.quoteActionResult = undefined;
        this.quoteForm.reset();
      }, 3000);
    }
  }

  formQuoteItem(): IQuote {
    if (!this.quoteForm.value.text || !this.quoteForm.value.author) {
      throw new Error('The required fields are empty');
    }
    return {
      id: 'quote' + Math.random().toString(16).slice(2),
      text: this.quoteForm.value.text,
      author: this.quoteForm.value.author,
    };
  }

  async loadUserQuotes() {
    if (!this.user?.email) return;
    this.quotes = await this.quotesService.getAllQuotes(this.user?.email);
    console.log(this.quotes);
  }
}
