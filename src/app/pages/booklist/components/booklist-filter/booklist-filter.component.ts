import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonComponent } from '../../../../shared/components/UI/button/button.component';
import { BooklistFilterContent } from './content/booklist-filter.content';
import { IBooklistFilter } from './models/booklist-filter.model';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BooksService } from '../../../../core/services/books.service';
import { IBook } from '../../../../shared/models/book.model';
import { IError } from '../../../../shared/models/error.model';

@Component({
  selector: 'app-booklist-filter',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    ButtonComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './booklist-filter.component.html',
  styleUrl: './booklist-filter.component.scss',
})
export class BooklistFilterComponent implements OnInit {
  bookService = inject(BooksService);
  filterContent: IBooklistFilter = BooklistFilterContent;

  filteredBooks: IBook[] = [];
  @Input() authorName: string | null = null;
  @Input() authorLimit: number | null = null;
  @Output() getFilteredBooks = new EventEmitter<IBook[]>();
  @Output() getFilterRequest = new EventEmitter<string>();
  @Output() getFilterLoading = new EventEmitter<boolean>();
  @Output() getFilterError = new EventEmitter<IError>();
  filterForm = new FormGroup({
    author: new FormControl({ value: '', disabled: false }),
    genre: new FormControl(null),
    yearFrom: new FormControl(null),
    yearTo: new FormControl(null),
    limit: new FormControl({ value: 0, disabled: false }, [Validators.min(1)]),
    sorting: new FormControl(null),
  });

  ngOnInit(): void {
    this.filterForm.controls.author.setValue(this.authorName);
    this.filterForm.controls.limit.setValue(this.authorLimit);
  }

  disabledUnusedFields(bool: boolean, ...fields: string[]) {
    if (bool) {
      for (const field of fields) {
        this.filterForm.get(field)?.disable();
      }
    } else {
      for (const field of fields) {
        this.filterForm.get(field)?.enable();
      }
    }
  }

  setFilterRequest() {
    let emitStr: string = '';
    if (this.filterForm.value.author) {
      emitStr = `author ${this.filterForm.value.author}`;
    } else if (this.filterForm.value.yearFrom && this.filterForm.value.yearTo) {
      emitStr = `genre "${this.filterForm.value.genre}" and published from ${this.filterForm.value.yearFrom} to ${this.filterForm.value.yearTo}`;
    } else {
      emitStr = `genre "${this.filterForm.value.genre}"`;
    }
    this.getFilterRequest.emit(emitStr);
  }

  onSubmit() {
    this.getFilterLoading.emit(true);
    if (this.filterForm.value.author) {
      this.bookService
        .getBooksByAuthor(
          this.filterForm.value.author,
          this.filterForm.value.limit && { limit: this.filterForm.value.limit }
        )
        .subscribe((res) => {
          this.submitSubscribe(res);
        });
    } else if (this.filterForm.value.genre) {
      if (this.filterForm.value.yearFrom && this.filterForm.value.yearTo) {
        const published_in =
          this.filterForm.value.yearFrom <= this.filterForm.value.yearTo
            ? this.filterForm.value.yearFrom +
              '-' +
              this.filterForm.value.yearTo
            : null;
        if (!published_in) {
          this.getFilterLoading.emit(false);
          this.getFilterError.emit({
            message: 'Invalid year values',
            code: 400,
          });
          this.formClean();
          return;
        }
        this.bookService
          .getBooksBySubject(this.filterForm.value.genre, {
            details: true,
            published_in: published_in,
            limit: this.filterForm.value.limit && this.filterForm.value.limit,
            sort: 'old',
          })
          .subscribe((res) => {
            this.submitSubscribe(res);
          });
      } else {
        this.bookService
          .getBooksBySubject(this.filterForm.value.genre, {
            limit: this.filterForm.value.limit && this.filterForm.value.limit,
            sort: 'old',
          })
          .subscribe((res) => {
            this.submitSubscribe(res);
          });
      }
    }
  }

  submitSubscribe(res: any) {
    this.filteredBooks = res.works ?? res.docs;
    this.getFilteredBooks.emit(this.filteredBooks);
    this.setFilterRequest();
    this.formClean();
  }

  formClean() {
    this.filterForm.reset();
    this.filterForm.enable();
  }
}
