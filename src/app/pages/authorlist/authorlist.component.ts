import { Component, OnInit, inject } from '@angular/core';
import { BooksService } from '../../core/services/books.service';
import { PaginationService } from '../../core/services/pagination.service';
import { IAuthor } from '../../shared/models/author.model';
import { CommonModule } from '@angular/common';
import { map, switchMap, tap } from 'rxjs';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../shared/components/UI/input/input.component';
import { ButtonComponent } from '../../shared/components/UI/button/button.component';

@Component({
  selector: 'app-authorlist',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
  ],
  providers: [PaginationService],
  templateUrl: './authorlist.component.html',
  styleUrl: './authorlist.component.scss',
})
export class AuthorlistComponent implements OnInit {
  booksService = inject(BooksService);
  paginationService = inject(PaginationService);

  searchAuthorForm = new FormGroup({
    authorName: new FormControl(''),
  });

  numFound!: number;
  loadingAuthors?: boolean;

  ngOnInit(): void {
    this.paginationService.itemsPerPage = 30;
    this.fetchData('gfgfhd');
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
