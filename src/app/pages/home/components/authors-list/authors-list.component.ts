import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { BooksService } from '../../../../core/services/books.service';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/UI/input/input.component';
import { ButtonComponent } from '../../../../shared/components/UI/button/button.component';
import { PaginationService } from '../../../../core/services/pagination.service';
import { AuthorlistService } from '../../../../core/services/authorlist.service';

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
  providers: [PaginationService, AuthorlistService],
  templateUrl: './authors-list.component.html',
  styleUrl: './authors-list.component.scss',
})
export class AuthorsListComponent implements OnInit {
  booksService = inject(BooksService);
  authorlistService = inject(AuthorlistService);
  paginationService = inject(PaginationService);

  searchAuthorForm = new FormGroup({
    authorName: new FormControl('Bronte'),
  });

  async ngOnInit() {
    if (!this.searchAuthorForm.value.authorName) {
      return;
    }
    this.authorlistService.loadingAuthors = true;

    await new Promise((resolve) => setTimeout(resolve, 3000));
    this.paginationService.itemsPerPage = 10;
    this.authorlistService.fetchData(this.searchAuthorForm.value.authorName);
  }

  onSearch() {
    if (!this.searchAuthorForm.value.authorName) {
      return;
    }
    this.authorlistService.fetchData(this.searchAuthorForm.value.authorName);
    this.paginationService.goToFirst();
    this.paginationService.setIfLastPage(this.authorlistService.numFound);
  }

  nextPage() {
    if (
      !this.searchAuthorForm.value.authorName ||
      this.paginationService.isLastPage
    ) {
      return;
    }
    this.paginationService.nextPage();
    this.authorlistService.fetchData(this.searchAuthorForm.value.authorName);
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
      this.authorlistService.fetchData(this.searchAuthorForm.value.authorName);
    }
  }
}
