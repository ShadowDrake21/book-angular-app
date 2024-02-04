import { CommonModule } from '@angular/common';
import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BooklistCatalogueComponent } from '../../shared/components/booklist-catalogue/booklist-catalogue.component';
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
export class BooklistComponent implements OnInit, OnDestroy {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  booksService = inject(BooksService);

  queryType: string = 'subject';
  queryParam!: string;
  subjectSub!: Subscription;
  subjectParam!: string;

  searchTitle!: string;

  books: IBook[] = [];
  loadingBooks?: boolean;
  isAfterFilter: boolean = false;

  errorWhileFetching: string = '';

  loadingFilterBooks?: boolean;
  filterError?: IError | null;

  ngOnInit(): void {
    this.getQueryParams();
    this.errorWhileFetching = '';
    if (this.queryParam.length) {
      switch (this.queryType) {
        case 'subject':
          this.loadingBooks = true;
          this.booksService.getBooksBySubject(this.queryParam).subscribe(
            (res) => {
              this.books = res.works;
              this.loadingBooks = false;
              console.log(this.books);
            },
            (err) => {
              this.errorWhileFetching = 'The subject has no books!';
            }
          );
          break;
        case 'author':
          this.loadingBooks = true;
          this.booksService
            .getBooksByAuthor(this.queryParam, { limit: 50 })
            .subscribe(
              (res) => {
                this.books = res.docs;
                this.loadingBooks = false;
                console.log('author books: ', this.books);
              },
              (err) => {
                this.errorWhileFetching = 'The author has no books!';
              }
            );
          break;
      }
    }
  }

  getQueryParams(): void {
    this.subjectSub = this.activatedRoute.queryParamMap.subscribe((params) => {
      this.queryType = params.keys[0];
      this.queryParam = params.get(this.queryType) || '';
      console.log(this.queryParam);
      // this.subjectParam = params.get('subject') || '';
    });
  }

  getFilteredBooks(books: IBook[]) {
    this.router.navigate([], {
      queryParams: {
        subject: null,
        author: null,
      },
      queryParamsHandling: 'merge',
    });
    this.isAfterFilter = true;
    this.loadingFilterBooks = false;
    this.books = books;
    this.filterError = null;
  }

  getFilterRequest(request: string) {
    this.searchTitle = request;
  }

  getFilterLoading(value: boolean) {
    this.loadingFilterBooks = value;
  }

  getFilterError(error: IError) {
    this.queryType = '';
    this.queryParam = '';
    this.isAfterFilter = false;
    this.loadingFilterBooks = false;
    this.filterError = error;
  }

  isAuthorParam(): boolean {
    return this.queryType === 'author';
  }

  formSearchTitle() {
    return this.queryParam
      ? `${!this.isAuthorParam() ? 'genre' : 'author'} "${this.queryParam}"`
      : this.searchTitle;
  }

  ngOnDestroy(): void {
    this.queryType = '';
    this.queryParam = '';
  }
}
