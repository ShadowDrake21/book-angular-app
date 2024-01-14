import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { BooksService } from '../../../../core/services/books.service';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/UI/input/input.component';
import { ButtonComponent } from '../../../../shared/components/UI/button/button.component';
import { BehaviorSubject, Observable, map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-authors-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './authors-list.component.html',
  styleUrl: './authors-list.component.scss',
})
export class AuthorsListComponent implements OnInit {
  bookService = inject(BooksService);

  searchAuthorForm = new FormGroup({
    authorName: new FormControl('Bronte'),
  });

  numFound!: number;
  loadingAuthors?: boolean;

  itemsPerPage: number = 10;
  currentPage$ = new BehaviorSubject(1);

  currentPageData$!: Observable<any>;
  isLastPage: boolean = false;
  isFirstPage: boolean = false;

  async ngOnInit() {
    if (!this.searchAuthorForm.value.authorName) {
      return;
    }
    this.loadingAuthors = true;

    await new Promise((resolve) => setTimeout(resolve, 3000));
    this.fetchData(this.searchAuthorForm.value.authorName);
  }

  fetchData(searchStr: string) {
    this.currentPageData$ = this.currentPage$.pipe(
      switchMap((currentPage) =>
        this.bookService.getAuthorsByName(
          searchStr,
          (currentPage - 1) * this.itemsPerPage,
          this.itemsPerPage
        )
      ),
      tap((res) => {
        this.numFound = res.numFound;
        this.loadingAuthors = false;
        this.checkLastPage();
        this.checkFirstPage();
      }),
      map((res: any) => {
        return res.docs;
      })
    );
  }

  calcNumPages(): number {
    let pages = Math.round(this.numFound / this.itemsPerPage);
    if (pages === 0) {
      return 1;
    }
    return pages;
  }

  checkLastPage() {
    const totalPages = this.calcNumPages();
    this.isLastPage = this.currentPage$.value === totalPages;
  }

  checkFirstPage() {
    this.isFirstPage = this.currentPage$.value === 1;
  }

  onSearch() {
    if (!this.searchAuthorForm.value.authorName) {
      return;
    }
    this.fetchData(this.searchAuthorForm.value.authorName);
    this.currentPage$.next(1);
    if (this.calcNumPages() === this.currentPage$.value) {
      this.isLastPage = true;
    }
  }

  nextPage() {
    if (!this.searchAuthorForm.value.authorName || this.isLastPage) {
      return;
    }
    this.currentPage$.next(this.currentPage$.value + 1);
    this.fetchData(this.searchAuthorForm.value.authorName);
  }

  prevPage() {
    if (!this.searchAuthorForm.value.authorName || this.isFirstPage) {
      return;
    }
    if (this.currentPage$.value > 1) {
      this.currentPage$.next(this.currentPage$.value - 1);
      this.fetchData(this.searchAuthorForm.value.authorName);
    }
  }
}
