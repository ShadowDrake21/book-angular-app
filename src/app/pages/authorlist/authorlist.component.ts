import { Component, OnInit, inject } from '@angular/core';
import { BooksService } from '../../core/services/books.service';
import { PaginationService } from '../../core/services/pagination.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../shared/components/UI/input/input.component';
import { ButtonComponent } from '../../shared/components/UI/button/button.component';
import { AuthorlistService } from '../../core/services/authorlist.service';
import { AuthorItemComponent } from '../../shared/components/author-item/author-item.component';

@Component({
  selector: 'app-authorlist',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    AuthorItemComponent,
  ],
  providers: [PaginationService, AuthorlistService],
  templateUrl: './authorlist.component.html',
  styleUrl: './authorlist.component.scss',
})
export class AuthorlistComponent implements OnInit {
  booksService = inject(BooksService);
  authorlistService = inject(AuthorlistService);
  paginationService = inject(PaginationService);

  searchAuthorForm = new FormGroup({
    authorName: new FormControl(''),
  });

  isBeforeFirstSearch: boolean = true;
  isDataAvailable: boolean = false;

  searchTitle: string = '';

  ngOnInit(): void {
    this.paginationService.itemsPerPage = 10;
  }

  async onSearch() {
    if (!this.searchAuthorForm.value.authorName) {
      return;
    }
    this.isBeforeFirstSearch = false;
    this.authorlistService.loadingAuthors = true;
    this.searchTitle = this.searchAuthorForm.value.authorName;
    this.authorlistService.fetchData(this.searchAuthorForm.value.authorName);
    this.authorlistService.isDataAvailable = false;
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
