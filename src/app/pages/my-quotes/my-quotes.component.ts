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
import { IItemResult } from '../../shared/models/general.model';

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
    id: new FormControl(''),
    text: new FormControl('', Validators.required),
    author: new FormControl('', Validators.required),
    workTitle: new FormControl(''),
  });

  loadingQuotes!: boolean;
  quotes: IQuote[] = [];
  quoteActionResult!: IItemResult | undefined;
  quoteBtnText: 'Add' | 'Update' = 'Add';
  isOnDelete!: boolean;

  ngOnInit(): void {
    this.loadingUser = true;
    this.loadingQuotes = true;
    this.authService.user$.subscribe(async (user: User | null) => {
      this.user = user;
      this.loadingUser = false;
      await this.loadUserQuotes();
    });
  }

  async onQuoteSubmit() {
    if (!this.user?.email) return;
    if (!this.quoteForm.value.id) {
      this.quoteForm.value.id = 'quote' + Math.random().toString(16).slice(2);
    }

    if (this.quoteBtnText === 'Add') {
      try {
        await this.handleQuoteAction(
          this.quotesService.addNewQuote(this.user.email, this.formQuoteItem())
        );
      } catch (error: any) {
        this.handleQuoteAction(Promise.reject(error));
      }
    } else {
      try {
        await this.handleQuoteAction(
          this.quotesService.updateQuote(
            this.user.email,
            this.quoteForm.value.id,
            this.formQuoteItem()
          )
        );
      } catch (error: any) {
        this.handleQuoteAction(Promise.reject(error));
      }
    }
  }

  async handleQuoteAction(actionPromise: Promise<any>) {
    try {
      await actionPromise;
      if (this.quoteBtnText === 'Add' && !this.isOnDelete) {
        this.quoteActionResult = {
          isSuccessfull: true,
          message: 'Quote successfully added!',
        };
      } else if (this.quoteBtnText === 'Update' && !this.isOnDelete) {
        this.quoteActionResult = {
          isSuccessfull: true,
          message: 'Quote successfully updated!',
        };
      } else if (this.isOnDelete) {
        console.log('deletion');
        this.quoteActionResult = {
          isSuccessfull: true,
          message: 'Quote successfully deleted!',
        };
      }
      this.loadingQuotes = true;
      await this.loadUserQuotes();
    } catch (error: any) {
      this.quoteActionResult = {
        isSuccessfull: false,
        message: error.message,
      };
    } finally {
      if (this.isOnDelete) this.isOnDelete = false;
      this.quoteForm.reset();
      setTimeout(() => {
        this.quoteActionResult = undefined;
      }, 3000);
    }
  }

  formQuoteItem(): IQuote {
    if (
      !this.quoteForm.value.id ||
      !this.quoteForm.value.text ||
      !this.quoteForm.value.author
    ) {
      throw new Error('The required fields are empty');
    }
    const quoteItem: IQuote = {
      id: this.quoteForm.value.id,
      text: this.quoteForm.value.text,
      author: this.quoteForm.value.author,
    };

    if (this.quoteForm.value.workTitle) {
      return {
        ...quoteItem,
        workTitle: this.quoteForm.value.workTitle,
      };
    } else {
      return quoteItem;
    }
  }

  async loadUserQuotes() {
    if (!this.user?.email) return;
    this.quotes = await this.quotesService.getAllQuotes(this.user?.email);
    this.loadingQuotes = false;
  }

  async editUserQuote(quoteId: string) {
    if (!this.user?.email) return;
    this.quoteBtnText = 'Update';
    let choosenQuote: IQuote | undefined = undefined;
    await this.quotesService
      .getQuote(this.user.email, quoteId)
      .then((quotes) => {
        choosenQuote = quotes[0];
        this.quoteForm.controls.id.setValue(choosenQuote.id);
        this.quoteForm.controls.text.setValue(choosenQuote.text);
        this.quoteForm.controls.author.setValue(choosenQuote.author);
        if (choosenQuote.workTitle)
          this.quoteForm.controls.workTitle.setValue(choosenQuote.workTitle);
      });
  }

  async deleteUserQuote(quoteId: string) {
    if (!this.user?.email) return;
    this.isOnDelete = true;
    await this.handleQuoteAction(
      this.quotesService.deleteQuote(this.user.email, quoteId)
    );
  }

  cancelManipulate() {
    this.quoteBtnText = 'Add';
    this.quoteForm.reset();
  }
}
