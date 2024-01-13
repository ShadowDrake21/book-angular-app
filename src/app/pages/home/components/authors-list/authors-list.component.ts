import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { BooksService } from '../../../../core/services/books.service';
import { Author } from '../../../../shared/models/author.model';
import { RouterModule } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../../../shared/components/UI/input/input.component';
import { ButtonComponent } from '../../../../shared/components/UI/button/button.component';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';

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

  async ngOnInit() {
    if (!this.searchAuthorForm.value.authorName) {
      return;
    }
    this.loadingAuthors = true;

    await new Promise((resolve) => setTimeout(resolve, 3000));
    this.fetchData(this.searchAuthorForm.value.authorName);
  }

  fetchData(searchStr: string) {
    // this.bookService
    //   .getAuthorsByName(searchStr, 0, 20)
    //   .subscribe(({ numFound, docs }) => {
    //     this.numFound = numFound;
    //     this.authorsList = docs;
    //     console.log(this.authorsList);
    //     this.loadingAuthors = false;
    //   });
    this.currentPageData$ = this.currentPage$.pipe(
      switchMap((currentPage) =>
        this.bookService.getAuthorsByName(
          searchStr,
          (currentPage - 1) * this.itemsPerPage,
          this.itemsPerPage
        )
      ),
      map((res: any) => {
        console.log(res);
        this.numFound = res.numFound;
        this.loadingAuthors = false;
        return res.docs;
      })
    );
  }

  onSearch() {
    console.log(this.searchAuthorForm.value.authorName);
    // if (
    //   !this.searchAuthorForm.value.authorName &&
    //   this.searchAuthorForm.value.authorName
    // ) {
    //   return;
    // }
    // this.bookService
    //   .getAuthorsByName(this.searchAuthorForm.value.authorName, 0, 20)
    //   .subscribe(({ numFound, docs }) => {
    //     this.numFound = numFound;
    //     this.authorsList = docs;
    //   });
    if (!this.searchAuthorForm.value.authorName) {
      return;
    }
    this.fetchData(this.searchAuthorForm.value.authorName);
    this.currentPage$.next(1);
  }

  nextPage() {
    if (!this.searchAuthorForm.value.authorName) {
      return;
    }
    this.currentPage$.next(this.currentPage$.value + 1);
    this.fetchData(this.searchAuthorForm.value.authorName);
    this.currentPageData$.subscribe((res) => console.log('next', res));
  }

  prevPage() {
    if (!this.searchAuthorForm.value.authorName) {
      return;
    }
    if (this.currentPage$.value > 1) {
      this.currentPage$.next(this.currentPage$.value - 1);
      this.fetchData(this.searchAuthorForm.value.authorName);
      this.currentPageData$.subscribe((res) => console.log('prev', res));
    }
  }
}
