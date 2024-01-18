import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BooklistCatalogueComponent } from './components/booklist-catalogue/booklist-catalogue.component';
import { BooklistFilterComponent } from './components/booklist-filter/booklist-filter.component';
import { Subscription } from 'rxjs';
import { BooksService } from '../../core/services/books.service';
import { IBook } from '../../shared/models/book.model';
import { IError } from '../../shared/models/error.model';

@Component({
  selector: 'app-booklist',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BooklistCatalogueComponent,
    BooklistFilterComponent,
  ],
  templateUrl: './booklist.component.html',
  styleUrl: './booklist.component.scss',
})
export class BooklistComponent implements OnInit {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  booksService = inject(BooksService);

  subjectSub!: Subscription;
  subjectParam!: string;

  searchTitle!: string;

  books: IBook[] = [];
  loadingBooks?: boolean;
  isAfterFilter: boolean = false;

  loadingFilterBooks?: boolean;
  filterError?: IError;

  ngOnInit(): void {
    this.getQueryParams();
    if (this.subjectParam.length) {
      this.loadingBooks = true;
      this.booksService
        .getBooksBySubject(this.subjectParam, {})
        .subscribe((res) => {
          this.books = res.works;
          this.loadingBooks = false;
          this.subjectParam = '';
        });
    }
  }

  getQueryParams(): void {
    this.subjectSub = this.activatedRoute.queryParamMap.subscribe((params) => {
      this.subjectParam = params.get('subject') || '';
    });
  }

  getFilteredBooks(books: IBook[]) {
    this.isAfterFilter = true;
    this.loadingFilterBooks = false;
    console.log('loading in booklist: ', this.loadingBooks);
    this.books = books;
  }

  getFilterRequest(request: string) {
    this.searchTitle = request;
  }

  getFilterLoading(value: boolean) {
    this.loadingFilterBooks = value;
  }

  getFilterError(error: IError) {
    this.filterError = error;
  }

  formSearchTitle() {
    return this.subjectParam
      ? `genre "${this.subjectParam}"`
      : this.searchTitle;
  }
}
