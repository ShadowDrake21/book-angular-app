import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { BooksService } from '../../../../core/services/books.service';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/UI/input/input.component';
import { ButtonComponent } from '../../../../shared/components/UI/button/button.component';
import { BehaviorSubject, Observable, map, switchMap, tap } from 'rxjs';
import { PaginationService } from '../../../../core/services/pagination.service';

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
  booksService = inject(BooksService);
  paginationService = inject(PaginationService);

  searchAuthorForm = new FormGroup({
    authorName: new FormControl('Bronte'),
  });

  numFound!: number;
  loadingAuthors?: boolean;

  async ngOnInit() {
    if (!this.searchAuthorForm.value.authorName) {
      return;
    }
    this.loadingAuthors = true;

    await new Promise((resolve) => setTimeout(resolve, 3000));
    this.paginationService.itemsPerPage = 10;
    this.fetchData(this.searchAuthorForm.value.authorName);
  }

  fetchData(searchStr: string) {
    this.paginationService.currentPageData$ =
      this.paginationService.currentPage$.pipe(
        switchMap((currentPage) =>
          this.booksService.getAuthorsByName(
            searchStr,
            (currentPage - 1) * this.paginationService.itemsPerPage,
            this.paginationService.itemsPerPage
          )
        ),
        tap((res) => {
          this.numFound = res.numFound;
          this.loadingAuthors = false;

          this.paginationService.checkLastPage(res.numFound);
          this.paginationService.checkFirstPage();
        }),
        map((res: any) => {
          return res.docs;
        })
      );
  }

  onSearch() {
    if (!this.searchAuthorForm.value.authorName) {
      return;
    }
    this.fetchData(this.searchAuthorForm.value.authorName);
    this.paginationService.goToFirst();
    this.paginationService.setIfLastPage(this.numFound);
  }

  nextPage() {
    if (
      !this.searchAuthorForm.value.authorName ||
      this.paginationService.isLastPage
    ) {
      return;
    }
    this.paginationService.nextPage();
    this.fetchData(this.searchAuthorForm.value.authorName);
  }

  prevPage() {
    if (
      !this.searchAuthorForm.value.authorName ||
      this.paginationService.isFirstPage
    ) {
      return;
    }
    if (this.paginationService.currentPage$.value > 1) {
      this.paginationService.prevPage();
      this.fetchData(this.searchAuthorForm.value.authorName);
    }
  }
}
