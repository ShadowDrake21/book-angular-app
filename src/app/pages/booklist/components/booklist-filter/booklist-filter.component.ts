import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonComponent } from '../../../../shared/components/UI/button/button.component';
import { BooklistFilterContent } from './content/booklist-filter.content';
import { IBooklistFilter } from './models/booklist-filter.model';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BooksService } from '../../../../core/services/books.service';
import { IBook } from '../../../../shared/models/book.model';

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
export class BooklistFilterComponent {
  bookService = inject(BooksService);
  filterContent: IBooklistFilter = BooklistFilterContent;

  filteredBooks: IBook[] = [];
  @Output() getFilteredBooks = new EventEmitter<IBook[]>();

  filterForm = new FormGroup({
    author: new FormControl({ value: '', disabled: false }),
    genre: new FormControl(null),
    yearFrom: new FormControl(null),
    yearTo: new FormControl(null),
  });

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

  onSubmit() {
    console.log(this.filterForm);
    if (this.filterForm.value.author) {
      this.bookService
        .getBooksByAuthor(this.filterForm.value.author, 10)
        .subscribe((res) => {
          this.filteredBooks = res.docs;
          this.getFilteredBooks.emit(this.filteredBooks);
          this.filterForm.reset();
        });
    } else if (this.filterForm.value.genre) {
      if (this.filterForm.value.yearFrom && this.filterForm.value.yearTo) {
        const published_in =
          this.filterForm.value.yearFrom + '-' + this.filterForm.value.yearTo;
        this.bookService
          .getBooksBySubject(this.filterForm.value.genre, {
            details: true,
            published_in: published_in,
            limit: 50,
          })
          .subscribe((res) => {
            this.filteredBooks = res.works;
            this.getFilteredBooks.emit(this.filteredBooks);
            this.filterForm.reset();
          });
      } else {
        this.bookService
          .getBooksBySubject(this.filterForm.value.genre, {
            limit: 50,
          })
          .subscribe((res) => {
            this.filteredBooks = res.works;
            this.getFilteredBooks.emit(this.filteredBooks);
            this.filterForm.reset();
          });
      }
    }
  }
}
