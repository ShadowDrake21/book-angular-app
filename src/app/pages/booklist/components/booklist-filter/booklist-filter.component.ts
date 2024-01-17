import { Component, OnInit, inject } from '@angular/core';
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

  filterForm = new FormGroup({
    author: new FormControl({ value: '', disabled: false }),
    genre: new FormControl(null),
    year: new FormControl(null),
  });

  disabledAuthorField(bool: boolean) {
    if (!bool) {
      this.filterForm.controls.author.enable();
    } else {
      this.filterForm.controls.author.disable();
    }
  }

  disabledGenreField(bool: boolean) {
    if (!bool) {
      this.filterForm.controls.genre.enable();
    } else {
      this.filterForm.controls.genre.disable();
    }
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

  onSubmit() {
    console.log(this.filterForm);
    if (!this.filterForm.value.genre) return;
    this.bookService.getBooksBySubject(this.filterForm.value.genre, {
      details: true,
      limit: 10,
    });
  }
}
